import React, { useEffect, useRef, useState } from 'react';
import { profile, experiences, projects, skills, education } from './content.js';
import { initialState, executeCommand, completeInput, directoryEntries } from './terminal.js';

const currentRole = experiences.find((job) => job.current);
const paths = directoryEntries.filter((entry) => entry.kind === 'directory');
const sectionPaths = { about: 'christina', experience: 'experience', projects: 'projects', skills: 'skills', education: 'education', contact: 'contact' };
const linkData = {
  github: { href: profile.github, label: 'GitHub', detail: 'github.com/seol404', icon: 'github' },
  linkedin: { href: profile.linkedin, label: 'LinkedIn', detail: 'Let’s connect', icon: 'link' },
  email: { href: `mailto:${profile.email}`, label: 'Email', detail: profile.email, icon: 'mail' },
  resume: { href: `${import.meta.env.BASE_URL}resume.pdf`, label: 'Download résumé', detail: 'PDF · experience, projects & education', icon: 'download' },
};

function Icon({ name = 'folder', size = 18, ...props }) {
  const shapes = {
    folder: <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
    terminal: <><path d="m5 6 6 6-6 6M13 18h6" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    external: <><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></>,
    moon: <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" /></>,
    link: <><path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 10a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-2 2" transform="translate(1 0) scale(.9)" /></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .2-2-.6-2.6 3-.3 6.1-1.5 6.1-6.4a5 5 0 0 0-1.4-3.5A4.6 4.6 0 0 0 19 2s-1.1-.4-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.1 1.6 5 2 5 2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.5 9c0 4.9 3.1 6.1 6.1 6.4C9 16 9 17 9 18v4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    reset: <><path d="M3 10a9 9 0 1 1 1 7M3 4v6h6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{shapes[name] || shapes.folder}</svg>;
}

function ExternalLink({ target, children, className = '' }) {
  const link = linkData[target];
  return <a className={className} href={link.href} {...(target === 'resume' ? { download: 'Christina-Lee-Resume.pdf' } : target !== 'email' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children || <><Icon name={link.icon} /><span>{link.label}</span><Icon name="external" size={13} /></>}</a>;
}

function Prompt({ cwd = '~', command, active = false }) {
  return <span className={`prompt ${active ? 'prompt-active' : ''}`}><span className="prompt-user">visitor</span><span className="prompt-host">@christina</span><span className="prompt-colon">:</span><span className="prompt-path">{cwd}</span><span className="prompt-symbol">$</span>{command !== undefined && <span className="executed-command">{command}</span>}</span>;
}

function SectionHeader({ path, title, subtitle }) {
  return <header className="section-heading"><div className="eyebrow">/{path} <span>/ README.md</span></div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</header>;
}

function Tags({ items }) {
  return <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

function Welcome({ run }) {
  return <div className="welcome">
    <div className="boot-line"><span>[ ok ]</span> guest session initialized <span className="boot-separator">·</span> make yourself at home.</div>
    <div className="welcome-hero">
      <div className="eyebrow">A HUMAN BEHIND THE TERMINAL</div>
      <h1>hello, world<span className="green">.</span><span className="hero-cursor" aria-hidden="true" /></h1>
      <p className="intro-name">I’m <strong>Christina Lee.</strong> <span className="wave" aria-hidden="true">✳</span></p>
      <p className="intro-copy">Curious about how systems work.<br />Even more curious about how to make them <span>secure.</span></p>
    </div>
    <dl className="system-info"><div><dt>focus</dt><dd>Security engineering</dd></div><div><dt>currently</dt><dd>{currentRole?.company || profile.university} <span className="inline-dot" /></dd></div><div><dt>education</dt><dd>Computer Science @ UT Austin</dd></div><div><dt>location</dt><dd>Austin, Texas <span className="muted">/ US</span></dd></div></dl>
    <div className="explore-heading"><span>LET’S LOOK AROUND</span><span>click a path or type a command ↓</span></div>
    <div className="explore-grid">{paths.map((entry) => <button className="explore-item" key={entry.name} onClick={() => run(`ls ${entry.path}`)}><span className="explore-path"><span className="ls-prefix">ls</span> {entry.path}<Icon name="arrow" size={15} /></span><span className="explore-description">{entry.description}</span></button>)}</div>
    <div className="welcome-note"><span className="green">↳</span> No terminal experience required. A little curiosity helps.</div>
  </div>;
}

function About({ run }) {
  return <section className="section-content"><SectionHeader path="christina" title="A little about me" subtitle="Security, systems, and the space in between." /><p className="lead-copy">{profile.intro}</p><div className="about-callout"><span className="comment">// what I work on</span><p>Finding the weaknesses. Understanding the root cause. Building something better.</p></div><dl className="detail-list"><div><dt>name</dt><dd>{profile.fullName}</dd></div><div><dt>based in</dt><dd>{profile.location}</dd></div><div><dt>studying</dt><dd>{profile.degree}</dd></div><div><dt>working at</dt><dd>{currentRole ? `${currentRole.company} · ${currentRole.role}` : profile.university}</dd></div></dl><button className="text-button" onClick={() => run('ls /experience')}>Follow the experience trail <Icon name="arrow" size={16} /></button></section>;
}

function Experience() {
  return <section className="section-content"><SectionHeader path="experience" title="Learning by building." subtitle="From the endpoint to the application to the cloud." /><div className="timeline">{experiences.map((job, index) => <article className="experience-entry" key={job.id}><div className={`timeline-node ${job.current ? 'current' : ''}`} /><div className="entry-meta"><span>{job.period}</span><span>{job.location}</span></div><div className="company-line"><h3>{job.company}</h3>{job.current && <span className="current-badge">current</span>}<span className="entry-number">0{index + 1}</span></div><p className="role-name">{job.role}</p><p className="entry-summary">{job.summary}</p><ul className="highlights">{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><Tags items={job.technologies} /></article>)}</div></section>;
}

function Projects() {
  return <section className="section-content"><SectionHeader path="projects" title="Under the hood." subtitle="A few things I’ve built to understand things a little better." />{projects.map((project, index) => <article className="project-entry" key={project.id}><div className="project-index"><span>0{index + 1}</span><span>{project.period}</span></div><h3>{project.name}</h3><p className="entry-summary">{project.summary}</p><ul className="highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><Tags items={project.technologies} /></article>)}<ExternalLink target="github" className="text-button">More from my corner of GitHub <Icon name="external" size={15} /></ExternalLink></section>;
}

function Skills() {
  return <section className="section-content"><SectionHeader path="skills" title="Tools of the trade." subtitle="The languages, systems, and tools I’ve worked with." /><div className="skill-groups">{skills.map((group, index) => <div className="skill-group" key={group.name}><span className="comment">0{index + 1}</span><div><h3>{group.name}</h3><Tags items={group.items} /></div></div>)}</div></section>;
}

function Education() {
  return <section className="section-content"><SectionHeader path="education" title="Always a student." /><div className="university"><span className="ut-monogram">UT</span><div><h3>{education.university}</h3><p>{education.location}</p></div></div><p className="lead-copy">{education.degree}</p><p className="comment">Concentration: <span className="green">{education.concentration}</span></p><h3 className="small-heading">Selected coursework</h3><Tags items={education.coursework} /></section>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timeout = useRef();
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyFailed(false); clearTimeout(timeout.current); timeout.current = setTimeout(() => setCopied(false), 2000); }
    catch { setCopyFailed(true); }
  };
  return <section className="section-content"><SectionHeader path="contact" title="Let’s connect." subtitle="Good conversations often start with a simple hello." /><div className="contact-list">{['email', 'github', 'linkedin', 'resume'].map((target) => <ExternalLink key={target} target={target} className="contact-link"><Icon name={linkData[target].icon} size={21} /><span><strong>{linkData[target].label}</strong><span>{linkData[target].detail}</span></span><Icon name="arrow" size={18} /></ExternalLink>)}</div><button className="text-button" onClick={copyEmail}>{copied ? '✓ Email copied' : 'Copy email address'}</button><span className="copy-status" role="status">{copied ? 'Email address copied to clipboard.' : copyFailed ? `Copy manually: ${profile.email}` : ''}</span></section>;
}

function Neofetch() {
  return <section className="neofetch"><pre aria-hidden="true">{'      .--.\n     |o_o |\n     |:_/ |\n    //   \\ \\\n   (|     | )\n  /’\\_   _/`\\\n  \\___)=(___/'}</pre><div><h3>christina<span className="muted">@</span>portfolio</h3><p className="comment">──────────────────────────</p><dl className="detail-list"><div><dt>OS</dt><dd>christinaOS 1.0 · web edition</dd></div><div><dt>Host</dt><dd>Austin, Texas</dd></div><div><dt>Shell</dt><dd>A little JavaScript</dd></div><div><dt>Focus</dt><dd>Security engineering</dd></div><div><dt>School</dt><dd>UT Austin</dd></div></dl><div className="color-swatches" aria-hidden="true">{['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map((color) => <i className={color} key={color} />)}</div></div></section>;
}

function Output({ output, run }) {
  switch (output.type) {
    case 'home': return <Welcome run={run} />;
    case 'about': return <About run={run} />;
    case 'experience': return <Experience />;
    case 'projects': return <Projects />;
    case 'skills': return <Skills />;
    case 'education': return <Education />;
    case 'contact': return <Contact />;
    case 'neofetch': return <Neofetch />;
    case 'directory': return <div className="directory-output"><div className="comment">{output.path} · {output.entries.length} entries</div>{output.entries.map((entry) => <button key={entry.path} onClick={() => run(`${entry.kind === 'directory' ? 'ls' : 'cat'} ${entry.path}`)}><Icon name={entry.kind === 'directory' ? 'folder' : 'file'} size={16} /><span>{entry.name}{entry.kind === 'directory' ? '/' : ''}</span><span className="comment">{entry.description}</span></button>)}</div>;
    case 'help': return <section className="help-output"><SectionHeader path="help" title="A small field guide." subtitle="This is a portfolio dressed as a terminal. Explore freely." /><dl>{output.commands.map((command) => <div key={command.command}><dt>{command.command}</dt><dd>{command.description}</dd></div>)}</dl><p className="comment">↑ ↓ command history · Tab autocomplete · Ctrl+L clear · Ctrl+C cancel</p><p className="comment">Prefer clicking? Every folder in the explorer is a shortcut.</p></section>;
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

  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('terminal-theme', theme); } catch { /* storage may be disabled */ } }, [theme]);
  useEffect(() => { const timer = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(timer); }, []);
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
      if (sectionPaths[result.output.type]) setActiveSection(sectionPaths[result.output.type]);
      else if (result.output.type === 'home' || result.output.type === 'directory') setActiveSection('home');
    }
    shouldScroll.current = true;
    setSidebarOpen(false);
    // Avoid opening a mobile keyboard when someone is exploring by touch.
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true });
  }

  function handleInputKey(event) {
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
    <header className="desktop-bar"><a className="os-brand" href="#" onClick={(event) => { event.preventDefault(); run('cat /README.md'); }}><Icon name="terminal" size={20} /><span>christina<span className="os-suffix">OS</span></span><span className="version">v1.0</span></a><div className="desktop-clock">{clock.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}<span>{clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span></div><div className="desktop-right"><span className="status-dot" /> <span>personal space on the internet</span><button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /></button></div></header>
    <main className="desktop-main"><div className="desktop-caption"><span><span className="caption-slash">~/</span> a work in progress, just like me.</span><span>EST. AUSTIN, TX <Icon name="pin" size={13} /></span></div>
      <div className="terminal-window">
        <div className="window-bar"><div className="window-controls" aria-hidden="true"><i /><i /><i /></div><span className="window-title"><Icon name="terminal" size={14} /> visitor@christina: {cwd}</span><button className="icon-button explorer-toggle" aria-label="Toggle file explorer" aria-expanded={sidebarOpen} aria-controls="file-explorer" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name={sidebarOpen ? 'close' : 'menu'} size={17} /></button><button className="icon-button reset-button" aria-label="Clear terminal" title="Clear terminal" onClick={() => run('clear')}><Icon name="reset" size={14} /></button></div>
        <div className="workspace">
          {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close file explorer" onClick={() => setSidebarOpen(false)} />}
          <aside id="file-explorer" className={`sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="File explorer"><div className="sidebar-label">EXPLORER <span>−</span></div><button className={`home-button ${activeSection === 'home' ? 'is-active' : ''}`} onClick={() => run('cat /README.md')}><span className="tree-chevron">⌄</span><Icon name="folder" size={16} /><span>christina</span><span className="home-tilde">~</span></button><nav aria-label="Portfolio directories" className="file-tree">{paths.map((entry) => <button className={`tree-item ${activeSection === entry.name ? 'is-active' : ''}`} key={entry.name} aria-label={`Open ${entry.path}`} aria-current={activeSection === entry.name ? 'page' : undefined} onClick={() => run(`ls ${entry.path}`)}><span className="tree-chevron">›</span><Icon name="folder" size={15} /><span>{entry.name}</span><span className="tree-slash">/</span></button>)}<button className="tree-item readme-item" onClick={() => run('cat /README.md')}><span className="tree-chevron" /><Icon name="file" size={14} /><span>README.md</span></button></nav><div className="sidebar-divider" /><div className="sidebar-label links-label">ELSEWHERE <Icon name="external" size={12} /></div><div className="sidebar-links"><ExternalLink target="github" /><ExternalLink target="linkedin" /><ExternalLink target="resume" /></div><div className="sidebar-bottom"><div className="tiny-prompt">&gt;_ <span>stay curious.</span></div><p>There’s always more<br />beneath the surface.</p><button onClick={() => run('help')} className="sidebar-help"><span>?</span> Command guide <span>↗</span></button></div></aside>
          <div className="terminal-pane"><div className="terminal-tabbar"><button onClick={() => inputRef.current?.focus()} className="terminal-tab"><Icon name="terminal" size={14} /> terminal <span className="tab-dot" /></button><span className="shell-label">interactive portfolio / guest</span></div>
            <div ref={outputRef} className="terminal-output" role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions" tabIndex={0}>{entries.length === 0 && <div className="empty-terminal"><Icon name="terminal" size={30} /><p>A fresh start.</p><span>Type <button onClick={() => run('help')}>help</button> or <button onClick={() => run('ls /')}>ls /</button> to explore.</span></div>}{entries.map((entry, index) => <div ref={index === entries.length - 1 ? lastEntryRef : undefined} className="command-entry" key={entry.id}><div className="command-line"><Prompt cwd={entry.cwd} command={entry.command} /></div><Output output={entry.output} run={run} /></div>)}</div>
            <div className="command-area">{suggestions.length > 0 && <div ref={completionRef} className="completion-list" role="group" aria-label="Command suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setInput(suggestion); setSuggestions([]); inputRef.current?.focus(); }}>{suggestion}</button>)}</div>}<form className="command-form" onSubmit={(event) => { event.preventDefault(); run(input); }}><label htmlFor="terminal-command" className="sr-only">Terminal command</label><Prompt cwd={cwd} active /><input id="terminal-command" ref={inputRef} value={input} onChange={(event) => { setInput(event.target.value); setHistoryIndex(null); setSuggestions([]); }} onKeyDown={handleInputKey} placeholder="type a command…" autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck="false" enterKeyHint="send" maxLength={4096} aria-describedby="input-hint" /><button className="run-button" type="submit" aria-label="Run command" title="Run command">↵</button></form><div id="input-hint" className="input-hints"><span><kbd>Tab</kbd> autocomplete <span className="hint-divider">·</span> <kbd>↑ ↓</kbd> history</span><button onClick={() => run('help')}><span className="hint-help">?</span> need a hand? type <strong>help</strong></button></div></div>
          </div>
        </div>
        <footer className="window-status"><span><span className="status-dot" /> all systems curious</span><span><span className="status-path">{cwd === '~' ? '/home/visitor' : cwd}</span><span className="status-encoding">UTF-8</span><span>portfolio.sh</span></span></footer>
      </div>
      <footer className="desktop-footer"><span>© {new Date().getFullYear()} Christina Lee</span><span>built with intention <span className="footer-star">✳</span> explored with curiosity</span><button onClick={() => run('neofetch')}>a little more about this system <span>↗</span></button></footer>
    </main>
  </div>;
}
