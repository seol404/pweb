# pweb

My ai-slopped (i spent some time unslopping and giving it some personality afterwards..i hope you can see the efforts) terminal-themed portfolio website!

Built with React 19 and Vite 7, with plain CSS and no backend.

## Run it

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev        # http://127.0.0.1:5173
```

Build and preview the production site:

```sh
npm run build      # writes to dist/
npm run preview    # http://127.0.0.1:4173
```

## Commands

| Command | Result |
| --- | --- |
| `ls /` or `ls` | List the root or the current directory |
| `ls /christina` | About Christina |
| `ls /experience` | Cloudflare, Bloomberg, CrowdStrike |
| `ls /leadership` | WiCyS Austin, ISSS, HASH |
| `ls /projects` | Vulnerability detection dataset and CPG pipeline |
| `ls /skills`, `ls /education` | Skills, UT Austin |
| `ls /hobbies` | Hobbies, including the art gallery |
| `ls /contact` | GitHub, LinkedIn, Substack |
| `cat /README.md` | Back to the home screen |
| `cd /experience`, `cd ..`, `cd` | Change directory, go up, go home |
| `pwd`, `whoami`, `neofetch` | Current path, about, system profile |
| `open github`, `open linkedin`, `open substack` | Show a link |
| `theme light`, `theme dark` | Switch theme |
| `history`, `clear`, `date`, `echo`, `help` | The usual |

Relative paths, `~`, `..`, quoted arguments, and `ls -a`, `ls -l`, and `ls -la` all work. Try `sudo`.

Keyboard shortcuts:

- **Tab** completes the command.
- **↑/↓** step through history.
- **Ctrl+L** clears the terminal.
- **Ctrl+C** clears the current input.
- **Ctrl/Cmd+K** focuses the prompt.

In the art gallery, **←/→** move between pieces and **Esc** closes it.

## Where things live

| Path | What |
| --- | --- |
| `src/content.js` | All portfolio content: profile, experience, leadership, projects, skills, education, hobbies, artworks |
| `src/terminal.js` | The virtual shell: paths, commands, tab completion |
| `src/App.jsx` | UI components, including the neofetch home screen, the art viewer, and the pixel longhorn |
| `src/App.css` | Styling for both themes |
| `src/fonts/` | Departure Mono by Helena Zhang (SIL OFL 1.1). It's crisp only at multiples of 11px |
| `public/art/` | The 10 artworks (`NN.webp`) and their thumbnails (`NN-thumb.webp`) |
| `public/_headers` | Security headers (strict CSP) and caching |
| `AGENTS.md` | Handoff notes and design rules for coding agents |

## Tests

```sh
npm test           # shell unit tests
npm run test:e2e   # Playwright; builds the site and runs against the preview server
```

Locally, the browser tests use your installed Google Chrome. In CI they use Playwright's Chromium:

```sh
npx playwright install chromium
CI=1 npm run test:e2e
```

## Deploy

The site deploys to Cloudflare Workers Static Assets using [`wrangler.jsonc`](wrangler.jsonc). It serves `dist/` under the name `christina-portfolio` and falls back to `index.html` for unknown paths.

```sh
npm run build
npx wrangler deploy
```

Wrangler asks you to log in to Cloudflare the first time. See [Static Assets](https://developers.cloudflare.com/workers/static-assets/get-started/) for details.
