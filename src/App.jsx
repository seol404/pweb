import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { profile, experiences, leadership, projects, skills, education, hobbies, artworks } from './content.js';
import { initialState, executeCommand, completeInput, directoryEntries } from './terminal.js';

const currentRole = experiences.find((job) => job.current);
const paths = directoryEntries.filter((entry) => entry.kind === 'directory');
const homeEntries = directoryEntries.filter((entry) => entry.name !== 'README.md');
const sectionPaths = { about: 'christina', experience: 'experience', leadership: 'leadership', projects: 'projects', skills: 'skills', education: 'education', hobbies: 'hobbies', contact: 'contact' };
// Sidebar folder for an output, or null for outputs like echo or help that belong to no folder.
const sectionFor = (output) => sectionPaths[output.type] || (output.type === 'home' || output.type === 'directory' ? 'home' : null);
// Blocks inside an output that print in one after another, like lines arriving from a shell.
const printLines = '.command-line, .tux, .neofetch h1, .neofetch h3, .neofetch dl > div, .color-swatches, .dir-list > li, .welcome-note, .section-heading, .lead-copy, .detail-list > div, .text-button, .experience-entry, .project-entry, .skill-group, .university, .concentration, .small-heading, .tags, .highlights > li, .contact-link, .help-output dl > div, .help-keys, .text-output, .error-output, .output-link';
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const linkData = {
  github: { href: profile.github, label: 'GitHub', detail: 'github.com/seol404', icon: 'github' },
  linkedin: { href: profile.linkedin, label: 'LinkedIn', detail: 'in/christinaseohyeonlee', icon: 'link' },
  substack: { href: profile.substack, label: 'Substack', detail: '@chrixtinalee', icon: 'substack' },
};
const tux = '    .--.\n   |o_o |\n   |:_/ |\n  //   \\ \\\n (|     | )\n/’\\_   _/`\\\n\\___)=(___/';
const ansi = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];
// UT longhorn traced from the official silhouette onto a 32 x 16 grid; # is a filled pixel.
const longhorn = [
  '#####......................#####',
  '...####..................####...',
  '.....###................###.....',
  '.......##################.......',
  '........################........',
  '..........############..........',
  '.........##############.........',
  '.........##.########.##.........',
  '.............######.............',
  '.............######.............',
  '.............######.............',
  '..............####..............',
  '..............####..............',
  '..............####..............',
  '..............####..............',
  '..............####..............',
];

function Icon({ name = 'folder', size = 16, ...props }) {
  const shapes = {
    folder: <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    terminal: <><path d="m5 6 6 6-6 6M13 18h6" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    external: <><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></>,
    moon: <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />,
    link: <><path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2" transform="translate(1 0) scale(.9)" /></>,
    substack: <path d="M5 4h14M5 8h14M5 12h14v8l-7-4-7 4Z" />,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .2-2-.6-2.6 3-.3 6.1-1.5 6.1-6.4a5 5 0 0 0-1.4-3.5A4.6 4.6 0 0 0 19 2s-1.1-.4-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.1 1.6 5 2 5 2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 9c0 4.9 3.1 6.1 6.1 6.4C9 16 9 17 9 18v4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    reset: <><path d="M3 10a9 9 0 1 1 1 7M3 4v6h6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{shapes[name] || shapes.folder}</svg>;
}

function ExternalLink({ target, children, className = '' }) {
  const link = linkData[target];
  return <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">{children || <><Icon name={link.icon} /><span>{link.label}</span></>}</a>;
}

function Prompt({ cwd = '~', command, active = false }) {
  return <span className={`prompt ${active ? 'prompt-active' : ''}`}><span className="prompt-user">visitor</span><span className="prompt-host">@christina</span><span className="prompt-colon">:</span><span className="prompt-path">{cwd}</span><span className="prompt-symbol">$</span>{command !== undefined && <span className="executed-command">{command}</span>}</span>;
}

function SectionHeader({ title }) {
  return <header className="section-heading"><h2>{title}</h2></header>;
}

function Longhorn() {
  return <svg className="longhorn" width="96" height="48" viewBox="0 0 32 16" shapeRendering="crispEdges" aria-hidden="true">{longhorn.flatMap((row, y) => [...row].map((pixel, x) => pixel === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null))}</svg>;
}

function Tags({ items }) {
  return <ul className="tags">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function DirList({ entries, run }) {
  return <ul className="dir-list">{entries.map((entry) => <li key={entry.path}><button onClick={() => run(`${entry.kind === 'directory' ? 'ls' : 'cat'} ${entry.path}`)}><span className="dir-mode" aria-hidden="true">{entry.kind === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'}</span><span className={`dir-name is-${entry.kind}`}>{entry.name}{entry.kind === 'directory' ? '/' : ''}</span><span className="dir-description">{entry.description}</span></button></li>)}</ul>;
}

function Neofetch({ home = false }) {
  const Title = home ? 'h1' : 'h3';
  const rows = [
    ['Role', currentRole ? `${currentRole.role}, ${currentRole.company}` : 'Student'],
    ['School', 'UT Austin, B.S. Computer Science'],
    ['Focus', 'Security engineering'],
    ['Host', profile.location],
    ['OS', 'christinaOS (web)'],
    ['Shell', 'React + Vite'],
  ];
  return <section className="neofetch"><pre className="tux" aria-hidden="true">{tux}</pre><div className="neofetch-info"><Title>{home ? profile.name : <>visitor<span className="muted">@</span>christina</>}</Title><dl>{rows.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><div className="color-swatches" aria-hidden="true">{ansi.map((color) => <i className={color} key={color} />)}</div></div></section>;
}

function Welcome({ run, navigate }) {
  return <div className="welcome"><Neofetch home /><DirList entries={homeEntries} run={navigate} /><p className="welcome-note">Click a folder or type a command. <button onClick={() => run('help')}>help</button> lists them all.</p></div>;
}

function About({ run }) {
  return <section className="section-content"><SectionHeader title="About Christina" /><p className="lead-copy">{profile.intro}</p><dl className="detail-list"><div><dt>name</dt><dd>{profile.fullName}</dd></div><div><dt>based in</dt><dd>{profile.location}</dd></div><div><dt>studying</dt><dd>{profile.degree}</dd></div><div><dt>working at</dt><dd>{currentRole ? `${currentRole.company}, ${currentRole.role}` : profile.university}</dd></div></dl><button className="text-button" onClick={() => run('ls /experience')}>ls /experience <Icon name="arrow" /></button></section>;
}

function Experience() {
  return <section className="section-content"><SectionHeader title="Experience" /><div className="timeline">{experiences.map((job) => <article className="experience-entry" key={job.id}><div className={`timeline-node ${job.current ? 'current' : ''}`} /><div className="entry-meta"><span>{job.period}</span><span>{job.location}</span></div><h3>{job.company}</h3><p className="role-name">{job.role}</p><p className="entry-summary">{job.summary}</p><ul className="highlights">{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><Tags items={job.technologies} /></article>)}</div></section>;
}

function Leadership() {
  return <section className="section-content"><SectionHeader title="Leadership" />{leadership.map((group) => <article className="project-entry" key={group.id}><p className="project-period">{group.period}</p><h3>{group.organization}</h3><p className="role-name">{group.role}</p></article>)}</section>;
}

function Projects() {
  return <section className="section-content"><SectionHeader title="Projects" />{projects.map((project) => <article className="project-entry" key={project.id}><p className="project-period">{project.period}</p><h3>{project.url ? <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.name} <Icon name="external" /></a> : project.name}</h3><p className="entry-summary">{project.summary}</p><ul className="highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><Tags items={project.technologies} /></article>)}<ExternalLink target="github" className="text-button">More on GitHub <Icon name="external" /></ExternalLink></section>;
}

function Skills() {
  return <section className="section-content"><SectionHeader title="Skills" /><div className="skill-groups">{skills.map((group) => <div className="skill-group" key={group.name}><h3>{group.name}</h3><Tags items={group.items} /></div>)}</div></section>;
}

function Education() {
  return <section className="section-content"><SectionHeader title="Education" /><div className="university"><Longhorn /><div><h3>{education.university}</h3><p>{education.location}</p></div></div><p className="lead-copy">{education.degree}</p><p className="concentration">Concentration: <span>{education.concentration}</span></p><h3 className="small-heading">Coursework</h3><Tags items={education.coursework} /></section>;
}

function ArtViewer({ open, onClose }) {
  const dialogRef = useRef(null);
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const scrollFrame = useRef(0);
  const [index, setIndex] = useState(0);
  const src = (art, suffix = '') => `${import.meta.env.BASE_URL}art/${art.id}${suffix}.webp`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) { dialog.showModal(); setIndex(0); trackRef.current.scrollLeft = 0; }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), []);
  useEffect(() => { thumbsRef.current?.children[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [index]);

  const goTo = (next) => {
    const target = Math.max(0, Math.min(artworks.length - 1, next));
    const track = trackRef.current;
    track.scrollTo({ left: target * track.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
    setIndex(target);
  };
  // Swiping or trackpad scrolling snaps one piece at a time; keep the counter in sync with what's in view.
  const handleScroll = () => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() => { const track = trackRef.current; if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth)); });
  };
  const handleKey = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index - 1); }
  };

  return <dialog ref={dialogRef} className="art-viewer" aria-label="Art gallery" onClose={onClose} onKeyDown={handleKey} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
    <div className="art-bar"><span className="art-title">art/{artworks[index].id}.webp <span className="muted">{index + 1} of {artworks.length}</span></span><button className="icon-button" aria-label="Close gallery" onClick={onClose}><Icon name="close" /></button></div>
    <div className="art-stage">
      <div ref={trackRef} className="art-track" onScroll={handleScroll}>{artworks.map((art, i) => <figure className="art-slide" key={art.id} aria-hidden={i !== index}><img src={src(art)} width={art.width} height={art.height} alt={art.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" /></figure>)}</div>
      <button className="art-nav is-prev" aria-label="Previous piece" disabled={index === 0} onClick={() => goTo(index - 1)}><Icon name="arrow" /></button>
      <button className="art-nav is-next" aria-label="Next piece" disabled={index === artworks.length - 1} onClick={() => goTo(index + 1)}><Icon name="arrow" /></button>
    </div>
    <div ref={thumbsRef} className="art-thumbs">{artworks.map((art, i) => <button key={art.id} className="art-thumb" aria-label={`Show piece ${i + 1}`} aria-current={i === index ? 'true' : undefined} onClick={() => goTo(i)}><img src={src(art, '-thumb')} alt="" loading="lazy" decoding="async" /></button>)}</div>
  </dialog>;
}

function Hobbies() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  return <section className="section-content"><SectionHeader title="Hobbies" /><ul className="highlights">{hobbies.map((hobby) => <li key={hobby.name}>{hobby.name}{hobby.detail && <span className="hobby-detail">{hobby.detail}</span>}{hobby.gallery && <button className="project-link hobby-link" onClick={() => setGalleryOpen(true)}>View {artworks.length} pieces <Icon name="arrow" /></button>}</li>)}</ul><ArtViewer open={galleryOpen} onClose={() => setGalleryOpen(false)} /></section>;
}

function Contact() {
  return <section className="section-content"><SectionHeader title="Contact" /><div className="contact-list">{['github', 'linkedin', 'substack'].map((target) => <ExternalLink key={target} target={target} className="contact-link"><Icon name={linkData[target].icon} /><span><strong>{linkData[target].label}</strong><span>{linkData[target].detail}</span></span><Icon name="arrow" /></ExternalLink>)}</div></section>;
}

function Output({ output, run, navigate }) {
  switch (output.type) {
    case 'home': return <Welcome run={run} navigate={navigate} />;
    case 'about': return <About run={navigate} />;
    case 'experience': return <Experience />;
    case 'leadership': return <Leadership />;
    case 'projects': return <Projects />;
    case 'skills': return <Skills />;
    case 'education': return <Education />;
    case 'hobbies': return <Hobbies />;
    case 'contact': return <Contact />;
    case 'neofetch': return <Neofetch />;
    case 'directory': return <div className="directory-output"><p className="muted">total {output.entries.length}</p><DirList entries={output.entries} run={navigate} /></div>;
    case 'help': return <section className="help-output"><SectionHeader title="Help" /><dl>{output.commands.map((command) => <div key={command.command}><dt>{command.command}</dt><dd>{command.description}</dd></div>)}</dl><p className="help-keys"><span><kbd>↑</kbd><kbd>↓</kbd> history</span><span><kbd>Tab</kbd> complete</span><span><kbd>Ctrl</kbd><kbd>L</kbd> clear</span><span><kbd>Ctrl</kbd><kbd>C</kbd> cancel</span></p><p className="muted">The folders in the sidebar run the same commands.</p></section>;
    case 'link': return <ExternalLink target={output.target} className="output-link" />;
    case 'error': return <p className="error-output">{output.text}</p>;
    default: return output.text ? <pre className="text-output">{output.text}</pre> : null;
  }
}

function initialTheme() {
  try { return localStorage.getItem('terminal-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [cwd, setCwd] = useState(initialState.cwd);
  const [entries, setEntries] = useState([{ id: 0, cwd: '~', command: 'cat README.md', output: { type: 'home' } }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [suggestions, setSuggestions] = useState([]);
  const [clock, setClock] = useState(new Date());
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const completionRef = useRef(null);
  const nextId = useRef(1);
  const lastEntryRef = useRef(null);
  const shouldScroll = useRef(false);
  const draftRef = useRef('');
  const scrollFrame = useRef(0);
  const typingTimer = useRef(0);
  const runRef = useRef(null);
  const treeRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('terminal-theme', theme); } catch { /* storage may be disabled */ } }, [theme]);
  useEffect(() => { const timer = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(timer); }, []);
  useEffect(() => () => { cancelAnimationFrame(scrollFrame.current); clearTimeout(typingTimer.current); }, []);
  // Stagger the newest entry's blocks so its output prints in rather than appearing all at once.
  useLayoutEffect(() => {
    const entry = lastEntryRef.current;
    if (!entry || entry.dataset.printed || reducedMotion()) return;
    entry.dataset.printed = 'true';
    entry.querySelectorAll(printLines).forEach((line, index) => {
      line.style.setProperty('--line', Math.min(index, 16));
      line.classList.add('print-in');
    });
  }, [entries]);
  // Slide one highlight between sidebar folders instead of swapping backgrounds.
  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const active = treeRef.current?.querySelector('.tree-item.is-active');
    if (!indicator) return;
    if (!active || !active.offsetWidth) { indicator.style.opacity = '0'; return; }
    const group = treeRef.current.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    indicator.style.opacity = '1';
    indicator.style.left = `${box.left - group.left}px`;
    indicator.style.width = `${box.width}px`;
    indicator.style.transform = `translateY(${box.top - group.top}px)`;
  }, [activeSection, sidebarOpen]);
  useEffect(() => { if (suggestions.length) completionRef.current?.querySelector('button')?.focus(); }, [suggestions]);
  useEffect(() => {
    if (shouldScroll.current && outputRef.current) {
      const container = outputRef.current;
      if (lastEntryRef.current) container.scrollTop = lastEntryRef.current.offsetTop - 24;
      else container.scrollTop = 0;
      shouldScroll.current = false;
    }
  }, [entries]);
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === 'Escape') { setSidebarOpen(false); setSuggestions([]); inputRef.current?.focus({ preventScroll: true }); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function run(rawCommand) {
    const command = rawCommand.trim();
    if (!command) return;
    const result = executeCommand(command, { cwd, theme, history });
    setHistory((old) => [...old, command].slice(-200));
    setHistoryIndex(null);
    setInput('');
    setSuggestions([]);
    draftRef.current = '';
    if (result.cwd !== undefined) setCwd(result.cwd);
    if (result.theme) setTheme(result.theme);
    if (result.clear) { setEntries([]); setActiveSection('terminal'); }
    else {
      const entry = { id: nextId.current++, cwd, command, output: result.output };
      setEntries((old) => [...old, entry].slice(-80));
      const section = sectionFor(result.output);
      if (section) setActiveSection(section);
    }
    shouldScroll.current = true;
    setSidebarOpen(false);
    // Avoid opening a mobile keyboard when someone is exploring by touch.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
  }

  runRef.current = run;

  // Type a clicked command into the prompt, then run it, so clicks read like someone using the shell.
  function typeAndRun(command) {
    clearTimeout(typingTimer.current);
    setSidebarOpen(false);
    if (reducedMotion()) { run(command); return; }
    let typed = 0;
    const step = () => {
      typed += 1;
      setInput(command.slice(0, typed));
      typingTimer.current = typed < command.length ? setTimeout(step, 18) : setTimeout(() => runRef.current(command), 120);
    };
    step();
  }

  // Clicks jump to a section already in the log instead of appending a copy; typed commands always append.
  function navigate(command) {
    const output = executeCommand(command, { cwd, theme, history }).output;
    const section = sectionFor(output);
    const existing = section && outputRef.current ? [...outputRef.current.querySelectorAll(`[data-output="${output.type}"]`)].at(-1) : null;
    if (!existing) { typeAndRun(command); return; }
    clearTimeout(typingTimer.current);
    setInput('');
    outputRef.current.scrollTop = existing.offsetTop - 24;
    setActiveSection(section);
    setSidebarOpen(false);
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
  }

  // Highlight the folder of whichever entry sits at the top third of the terminal while scrolling.
  function handleOutputScroll() {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(() => {
      const container = outputRef.current;
      const nodes = container ? [...container.querySelectorAll('[data-section]')] : [];
      if (!nodes.length) return;
      const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
      const line = container.scrollTop + container.clientHeight / 3;
      const current = atBottom ? nodes.at(-1) : nodes.filter((node) => node.offsetTop <= line).at(-1) || nodes[0];
      setActiveSection(current.dataset.section);
    });
  }

  function handleInputKey(event) {
    clearTimeout(typingTimer.current);
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowUp' && history.length) {
      event.preventDefault();
      if (historyIndex === null) draftRef.current = input;
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index); setInput(history[index]); setSuggestions([]);
    } else if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault();
      const index = historyIndex + 1;
      setHistoryIndex(index >= history.length ? null : index);
      setInput(index >= history.length ? draftRef.current : history[index]); setSuggestions([]);
    } else if (event.key === 'Tab' && input.trim() && !event.shiftKey) {
      const matches = completeInput(input, cwd);
      if (matches.length && !(matches.length === 1 && matches[0] === input) && !suggestions.length) {
        event.preventDefault();
        if (matches.length === 1) { setInput(matches[0] + (matches[0].includes(' ') ? '' : ' ')); setSuggestions([]); }
        else { setSuggestions(matches); }
      }
    } else if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); run('clear'); }
    else if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      if (!window.getSelection()?.toString()) { event.preventDefault(); setInput(''); setHistoryIndex(null); setSuggestions([]); }
    }
  }

  return <div className="desktop">
    <a className="skip-link" href="#terminal-command">Skip to terminal</a>
    <header className="desktop-bar"><a className="os-brand" href="#" onClick={(event) => { event.preventDefault(); navigate('cat /README.md'); }}><Icon name="terminal" /><span>christina<span className="os-suffix">OS</span></span></a><div className="desktop-clock">{clock.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}<span>{clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></div><button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button></header>
    <main className="desktop-main">
      <div className="terminal-window">
        <div className="window-bar"><button className="icon-button explorer-toggle" aria-label="Toggle file explorer" aria-expanded={sidebarOpen} aria-controls="file-explorer" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name={sidebarOpen ? 'close' : 'menu'} /></button><span className="window-title">visitor@christina: {cwd}</span><button className="icon-button reset-button" aria-label="Clear terminal" title="Clear terminal" onClick={() => run('clear')}><Icon name="reset" /></button></div>
        <div className="workspace">
          {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close file explorer" onClick={() => setSidebarOpen(false)} />}
          <aside id="file-explorer" className={`sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="File explorer"><p className="sidebar-label">Files</p><div className="tree-group" ref={treeRef}><span className="tree-indicator" ref={indicatorRef} aria-hidden="true" /><button className={`tree-item home-button ${activeSection === 'home' ? 'is-active' : ''}`} onClick={() => navigate('cat /README.md')}><Icon name="folder" /><span>~</span></button><nav aria-label="Portfolio directories" className="file-tree">{paths.map((entry) => <button className={`tree-item ${activeSection === entry.name ? 'is-active' : ''}`} key={entry.name} aria-label={`Open ${entry.path}`} aria-current={activeSection === entry.name ? 'page' : undefined} onClick={() => navigate(`ls ${entry.path}`)}><Icon name="folder" /><span>{entry.name}</span><span className="tree-slash">/</span></button>)}<button className="tree-item" onClick={() => navigate('cat /README.md')}><Icon name="file" /><span>README.md</span></button></nav></div><p className="sidebar-label">Links</p><div className="sidebar-links"><ExternalLink target="github" /><ExternalLink target="linkedin" /><ExternalLink target="substack" /></div><button onClick={() => run('help')} className="tree-item sidebar-help"><Icon name="terminal" /><span>help</span></button></aside>
          <div className="terminal-pane">
            <div ref={outputRef} className="terminal-output" onScroll={handleOutputScroll} role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions" tabIndex={0}>{entries.length === 0 && <p className="empty-terminal">Type <button onClick={() => run('help')}>help</button> or <button onClick={() => run('ls /')}>ls /</button> to start.</p>}{entries.map((entry, index) => <div ref={index === entries.length - 1 ? lastEntryRef : undefined} className="command-entry" data-section={sectionFor(entry.output) || undefined} data-output={entry.output.type} key={entry.id}><div className="command-line"><Prompt cwd={entry.cwd} command={entry.command} /></div><Output output={entry.output} run={run} navigate={navigate} /></div>)}</div>
            <div className="command-area">{suggestions.length > 0 && <div ref={completionRef} className="completion-list" role="group" aria-label="Command suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setInput(suggestion); setSuggestions([]); inputRef.current?.focus(); }}>{suggestion}</button>)}</div>}<form className="command-form" onSubmit={(event) => { event.preventDefault(); run(input); }}><label htmlFor="terminal-command" className="sr-only">Terminal command</label><Prompt cwd={cwd} active /><input id="terminal-command" ref={inputRef} value={input} onChange={(event) => { clearTimeout(typingTimer.current); setInput(event.target.value); setHistoryIndex(null); setSuggestions([]); }} onKeyDown={handleInputKey} placeholder="type help" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck="false" enterKeyHint="send" maxLength={4096} aria-describedby="input-hint" /><button className="run-button" type="submit" aria-label="Run command" title="Run command">↵</button></form></div>
          </div>
        </div>
        <footer className="window-status"><span>© {new Date().getFullYear()} Christina Lee</span><span id="input-hint" className="input-hints"><span><kbd>Tab</kbd> complete</span><span><kbd>↑</kbd><kbd>↓</kbd> history</span><span><kbd>Ctrl</kbd><kbd>K</kbd> focus</span></span></footer>
      </div>
    </main>
  </div>;
}
