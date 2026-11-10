import test from 'node:test';
import assert from 'node:assert/strict';
import { completeInput, executeCommand, initialState, resolvePath } from './terminal.js';

test('portfolio sections are readable through ls, cat, and relative navigation', () => {
  let state = { ...initialState };
  assert.equal(executeCommand('ls /christina', state).output.type, 'about');
  assert.equal(executeCommand('ls /experience', state).output.type, 'experience');
  state = { ...state, ...executeCommand('cd /experience', state) };
  assert.equal(state.cwd, '/experience');
  assert.equal(executeCommand('pwd', state).output.text, '/experience');
  assert.equal(executeCommand('ls', state).output.type, 'experience');
  assert.equal(executeCommand('cat README.md', state).output.type, 'experience');
  assert.equal(executeCommand('ls ../projects', state).output.type, 'projects');
  state = { ...state, ...executeCommand('cd ..', state) };
  assert.equal(state.cwd, '~');
  assert.equal(executeCommand('pwd', state).output.text, '/');
  assert.equal(executeCommand('ls', state).output.type, 'directory');
});

test('every listed root path resolves and directories can be entered', () => {
  const listing = executeCommand('ls /').output;
  for (const entry of listing.entries) {
    assert.notEqual(executeCommand(`ls ${entry.path}`).output.type, 'error', entry.path);
    const change = executeCommand(`cd ${entry.path}`);
    assert.equal(change.output.type === 'error', entry.kind === 'file', entry.path);
  }
  assert.equal(executeCommand('cat /README.md').output.type, 'home');
});

test('virtual paths normalize dot segments, root boundaries, and home', () => {
  assert.equal(resolvePath('../../../projects', '/experience'), '/projects');
  assert.equal(resolvePath('~/skills', '/experience'), '/skills');
  assert.equal(resolvePath('/projects//./../christina/'), '/christina');
  assert.equal(executeCommand('cd', { cwd: '/projects' }).cwd, '~');
  assert.equal(executeCommand('cd /../../').cwd, '~');
  assert.equal(executeCommand('ls /experience/missing/../README.md').output.type, 'experience');
});

test('invalid paths and arguments return useful errors without changing state', () => {
  for (const input of ['cd /missing', 'cd README.md', 'cat /resume.pdf', 'ls /etc/passwd', 'cat', 'ls -z', 'ls /projects /skills', 'cd /experience /projects', 'cat "unterminated']) {
    const result = executeCommand(input);
    assert.equal(result.output.type, 'error', input);
    assert.ok(result.output.text.length > 0, input);
    assert.equal(result.cwd, undefined, input);
  }
  assert.equal(executeCommand('ls -la /skills').output.type, 'skills');
  assert.equal(executeCommand('ls -- /skills').output.type, 'skills');
  assert.equal(executeCommand('cat "/christina/README.md"').output.type, 'about');
});

test('commands return safe display instructions with no arbitrary URL or code execution', () => {
  assert.deepEqual(executeCommand('open github').output, { type: 'link', target: 'github' });
  assert.deepEqual(executeCommand('open substack').output, { type: 'link', target: 'substack' });
  assert.equal(executeCommand('open resume').output.type, 'error');
  assert.equal(executeCommand('open email').output.type, 'error');
  assert.equal(executeCommand('open javascript:alert(1)').output.type, 'error');
  assert.equal(executeCommand('open https://example.com').output.type, 'error');
  assert.equal(executeCommand('rm -rf /').output.type, 'error');
  assert.equal(executeCommand('echo "<script>alert(1)</script>"').output.text, '<script>alert(1)</script>');
  assert.equal(executeCommand('echo "$(whoami)"').output.text, '$(whoami)');
  assert.equal(executeCommand('sudo rm -rf /').output.type, 'text');
  assert.equal(executeCommand('ls /').output.entries.length, 9);
});

test('theme, clear, and history produce explicit session updates', () => {
  assert.equal(executeCommand('theme light').theme, 'light');
  assert.equal(executeCommand('theme dark').theme, 'dark');
  assert.equal(executeCommand('theme light extra').output.type, 'error');
  assert.equal(executeCommand('theme invalid').theme, undefined);
  assert.match(executeCommand('theme', { theme: 'light' }).output.text, /light/);
  assert.equal(executeCommand('clear').clear, true);
  const history = ['ls /christina', 'ls /experience'];
  assert.match(executeCommand('history', { history }).output.text, /1  ls \/christina\n\s*2  ls \/experience/);
  assert.deepEqual(history, ['ls /christina', 'ls /experience']);
  assert.deepEqual(executeCommand('  '), { output: { type: 'text', text: '' } });
});

test('completion works for command names, absolute paths, relative paths and options', () => {
  assert.deepEqual(completeInput('neo'), ['neofetch']);
  assert.deepEqual(completeInput('ls /exp'), ['ls /experience']);
  assert.deepEqual(completeInput('cat RE', '/experience'), ['cat README.md']);
  assert.deepEqual(completeInput('ls ../proj', '/experience'), ['ls ../projects']);
  assert.deepEqual(completeInput('ls -la /con'), ['ls -la /contact']);
  assert.deepEqual(completeInput('cd /REA'), []);
  assert.deepEqual(completeInput('cat /experience/'), ['cat /experience/README.md']);
  assert.deepEqual(completeInput('open g'), ['open github']);
  assert.deepEqual(completeInput('theme l'), ['theme light']);
  assert.deepEqual(completeInput('ls /missing/'), []);
  assert.deepEqual(completeInput('ls /projects /exp'), []);
});
