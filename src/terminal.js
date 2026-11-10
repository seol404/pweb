/**
 * A small virtual shell. Commands only return display data; they never execute
 * code, access the host filesystem, or launch a browser window.
 */
export const initialState = Object.freeze({ cwd: '~', theme: 'dark' });

const folders = [
  { name: 'christina', type: 'about', description: 'A little about me' },
  { name: 'experience', type: 'experience', description: 'Where I have worked' },
  { name: 'projects', type: 'projects', description: 'Things I have built' },
  { name: 'skills', type: 'skills', description: 'Tools of the trade' },
  { name: 'education', type: 'education', description: 'Learning at UT Austin' },
  { name: 'contact', type: 'contact', description: 'Find me elsewhere' },
];

export const directoryEntries = Object.freeze([
  ...folders.map(({ name, description }) => ({ name, path: `/${name}`, kind: 'directory', description })),
  { name: 'README.md', path: '/README.md', kind: 'file', description: 'Welcome to my corner of the internet' },
  { name: 'resume.pdf', path: '/resume.pdf', kind: 'file', description: 'Download my résumé' },
]);

export const commandHelp = Object.freeze([
  { command: 'ls [path]', description: 'Explore a directory. Try ls /experience.' },
  { command: 'cat [path]', description: 'Read a section or its README.md.' },
  { command: 'cd [path]', description: 'Change directories. cd .. goes back; cd returns home.' },
  { command: 'pwd', description: 'Print the current directory.' },
  { command: 'whoami', description: 'Meet Christina.' },
  { command: 'neofetch', description: 'Show the system profile.' },
  { command: 'open [link]', description: 'Show a link: github, linkedin, resume, or email.' },
  { command: 'theme [dark|light]', description: 'Switch the terminal theme.' },
  { command: 'history', description: 'Show commands from this session.' },
  { command: 'clear', description: 'Clear the terminal. Ctrl+L works too.' },
  { command: 'date', description: 'Show the current date and time.' },
  { command: 'echo [text]', description: 'Print some text.' },
  { command: 'help', description: 'Show this command reference.' },
]);

const commands = [...commandHelp.map(({ command }) => command.split(' ')[0]), 'sudo'];
const links = ['github', 'linkedin', 'resume', 'email'];
const text = (value = '') => ({ output: { type: 'text', text: value } });
const error = (value) => ({ output: { type: 'error', text: value } });

/** Normalize a virtual path, keeping .. at the root instead of escaping it. */
export function resolvePath(path = '~', cwd = '~') {
  let absolute;
  if (path === '~' || path.startsWith('~/')) absolute = `/${path.slice(2)}`;
  else if (path.startsWith('/')) absolute = path;
  else absolute = `${cwd === '~' ? '/' : cwd}/${path}`;

  const segments = [];
  for (const segment of absolute.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') segments.pop();
    else segments.push(segment);
  }
  return `/${segments.join('/')}`;
}

function nodeAt(path) {
  if (path === '/') return { kind: 'directory', type: 'directory' };
  if (path === '/README.md') return { kind: 'file', type: 'home' };
  if (path === '/resume.pdf') return { kind: 'file', type: 'link', target: 'resume' };
  const folder = folders.find(({ name }) => path === `/${name}` || path === `/${name}/README.md`);
  if (!folder) return null;
  return { kind: path.endsWith('/README.md') ? 'file' : 'directory', type: folder.type };
}

function outputFor(path) {
  const node = nodeAt(path);
  if (node.type === 'directory') return { type: 'directory', path, entries: directoryEntries };
  if (node.type === 'link') return { type: 'link', target: node.target };
  return { type: node.type };
}

/** Tokenize simple quoted arguments. Deliberately no expansion or shell eval. */
function tokenize(input) {
  const tokens = [];
  let token = '';
  let quote = null;
  let escaped = false;
  let started = false;

  for (const character of input) {
    if (escaped) {
      token += character;
      escaped = false;
      started = true;
    } else if (character === '\\' && quote !== "'") {
      escaped = true;
      started = true;
    } else if (quote) {
      if (character === quote) quote = null;
      else token += character;
    } else if (character === '"' || character === "'") {
      quote = character;
      started = true;
    } else if (/\s/.test(character)) {
      if (started) tokens.push(token);
      token = '';
      started = false;
    } else {
      token += character;
      started = true;
    }
  }
  if (quote) return { error: 'Unclosed quote. Close the quote and try again.' };
  if (escaped) token += '\\';
  if (started) tokens.push(token);
  return { tokens };
}

export function executeCommand(input, { cwd = '~', theme = 'dark', history = [] } = {}) {
  if (typeof input !== 'string') return error('Please enter a command. Type help to get started.');
  if (input.length > 4096) return error('That command is too long. Please use fewer than 4,097 characters.');
  const parsed = tokenize(input.trim());
  if (parsed.error) return error(parsed.error);
  const [command, ...args] = parsed.tokens;
  if (!command) return text();

  if (['ls', 'cat', 'cd'].includes(command)) {
    let paths = args;
    if (command === 'ls') {
      paths = [];
      let parseOptions = true;
      for (const arg of args) {
        if (parseOptions && arg === '--') { parseOptions = false; continue; }
        if (parseOptions && arg.startsWith('-')) {
          if (!/^-[al]+$/.test(arg)) return error(`ls: unsupported option: ${arg}. Try ls or ls -la /.`);
        } else paths.push(arg);
      }
    }
    if (paths.length > 1) return error(`${command}: please use one path at a time.`);
    if (command === 'cat' && !paths.length) return error('cat: missing path. Try cat /christina/README.md.');
    const path = resolvePath(paths[0] ?? (command === 'cd' ? '~' : cwd), cwd);
    const node = nodeAt(path);
    if (!node) return error(`${command}: ${paths[0] ?? path}: No such file or directory. Try ls /.`);
    if (command === 'cd') {
      if (node.kind !== 'directory') return error(`cd: ${paths[0]}: Not a directory.`);
      return { cwd: path === '/' ? '~' : path, ...text() };
    }
    return { output: outputFor(path) };
  }

  switch (command) {
    case 'help':
      return { output: { type: 'help', commands: commandHelp } };
    case 'pwd':
      return text(resolvePath(cwd));
    case 'clear':
      return { clear: true, ...text() };
    case 'history':
      return text(history.length ? history.map((entry, index) => `${String(index + 1).padStart(3, ' ')}  ${entry}`).join('\n') : 'No commands yet.');
    case 'whoami':
      return { output: { type: 'about' } };
    case 'neofetch':
      return { output: { type: 'neofetch' } };
    case 'date':
      return text(new Date().toString());
    case 'echo':
      return text(args.join(' '));
    case 'theme':
      if (!args.length) return text(`Current theme: ${theme}. Usage: theme dark | theme light`);
      if (args.length !== 1 || !['dark', 'light'].includes(args[0])) return error('theme: choose dark or light.');
      return { theme: args[0], ...text(`Theme set to ${args[0]}.`) };
    case 'open':
      if (args.length !== 1) return error('Usage: open github | linkedin | resume | email');
      if (args[0] === '/resume.pdf' || args[0] === 'resume.pdf') return { output: { type: 'link', target: 'resume' } };
      if (!links.includes(args[0])) return error(`open: unknown link: ${args[0]}. Choose github, linkedin, resume, or email.`);
      return { output: { type: 'link', target: args[0] } };
    case 'sudo':
      return text('Nice try. You already have everything you need here. Type help to explore.');
    default:
      return error(`${command}: command not found. Type help to see what is available.`);
  }
}

/** Full-input suggestions; the UI owns cycling and applying completion. */
export function completeInput(input, cwd = '~') {
  if (typeof input !== 'string' || input.length > 4096) return [];
  const trimmed = input.trimStart();
  if (!/\s/.test(trimmed)) return commands.filter((command) => command.startsWith(trimmed)).sort();
  const match = trimmed.match(/^(\S+)\s+(.*)$/s);
  if (!match) return [];
  const [, command, remainder] = match;
  if (command === 'theme') return ['dark', 'light'].filter((theme) => theme.startsWith(remainder)).map((theme) => `theme ${theme}`);
  if (command === 'open') return links.filter((link) => link.startsWith(remainder)).map((link) => `open ${link}`);
  if (!['ls', 'cat', 'cd'].includes(command)) return [];

  const parts = remainder.split(/\s+/);
  const partial = parts.pop() ?? '';
  if (parts.length && (command !== 'ls' || parts.some((part) => !/^-[al]+$/.test(part)))) return [];
  // Quoted paths are accepted by the shell, but these simple virtual names
  // never need quotes. Avoid replacing a partially entered quoted argument.
  if (/["'\\]/.test(partial)) return [];

  const slash = partial.lastIndexOf('/');
  const base = slash >= 0 ? partial.slice(0, slash + 1) : '';
  const fragment = partial.slice(slash + 1);
  const parent = resolvePath(base || '.', cwd);
  let entries = [];
  if (parent === '/') entries = directoryEntries;
  else if (nodeAt(parent)?.kind === 'directory') entries = [{ name: 'README.md', kind: 'file' }];
  if (command === 'cd') entries = entries.filter(({ kind }) => kind === 'directory');
  const prefix = [command, ...parts].join(' ');
  return entries.filter(({ name }) => name.startsWith(fragment)).map(({ name }) => `${prefix} ${base}${name}`);
}
