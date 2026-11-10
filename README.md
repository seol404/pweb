# Christina’s terminal portfolio

A Linux-inspired portfolio built with React and Vite. Visitors can explore through a virtual shell or click folders in the file explorer. The app is entirely static; terminal commands only navigate portfolio content in the browser.

Use Node.js **22.12 or newer**. From the repository root:

```sh
cd terminal-portfolio
npm ci
npm run dev
```

Open the local URL Vite prints, usually `http://127.0.0.1:5173`. `npm start` is an alias for `npm run dev`.

To build and preview the production site:

```sh
npm run build
npm run preview
```

The production files are written to `dist/`; the preview usually runs at `http://127.0.0.1:4173`. These scripts use project-local dependencies, so neither a global `serve` installation nor `sudo` is needed. The old Create React App message about hosting at `/` referred to the root URL of a website, such as `https://example.com/`, not the filesystem root on your Mac.

Try these commands inside the website:

| Command | Result |
| --- | --- |
| `ls /` or `ls` | List folders at the root or content in the current directory. |
| `ls /christina` | Read Christina’s introduction. |
| `ls /experience` | Explore Cloudflare, Bloomberg, and CrowdStrike roles. |
| `ls /projects` | Read about the vulnerability detection pipeline and PintOS. |
| `ls /skills`, `ls /education`, `ls /contact` | View skills, education, or contact links. |
| `cat /README.md` | Return to the welcome screen. |
| `cat /experience/README.md` | Read a directory’s content. |
| `cd /experience`, `cd ..`, `cd` | Change directory, go up, or return home. |
| `pwd` | Print the current virtual path. |
| `whoami`, `neofetch` | Show the introduction or system-style profile. |
| `open github`, `open linkedin`, `open substack` | Display a clickable destination link. |
| `theme light`, `theme dark` | Change the color theme. |
| `history`, `clear`, `date`, `echo hello`, `help` | Recall commands, clear output, show time, print text, or view help. |

Relative paths, `~`, `..`, quoted arguments, and `ls -a`, `ls -l`, and `ls -la` work. `sudo` has a small easter egg. This is a portfolio shell with a fixed command set; it does not execute operating-system commands.

While the command input is focused, **Tab** completes nonempty input or shows matching suggestions; **↑/↓** recall command history; **Ctrl+L** clears the terminal; **Ctrl+C** clears the current input when no text is selected. **Ctrl/Cmd+K** focuses the prompt from elsewhere on the page. Empty-input Tab and Shift+Tab retain normal keyboard navigation.

Edit biography, roles, projects, skills, and education in [`src/content.js`](src/content.js). The UI is in [`src/App.jsx`](src/App.jsx), styling in [`src/App.css`](src/App.css), and virtual-shell behavior in [`src/terminal.js`](src/terminal.js).

Run the shell tests and browser tests from `terminal-portfolio/`:

```sh
npm test
npm run test:e2e
```

Browser tests build the site and start Vite’s production preview server, using installed Google Chrome locally. In CI, the configuration uses Playwright’s bundled Chromium:

```sh
npx playwright install chromium
CI=1 npm run test:e2e
```

To host with **Cloudflare Pages**, push the repository to GitHub or GitLab, then use **Workers & Pages → Create application → Pages → Import an existing Git repository** in the Cloudflare dashboard. Use these settings:

| Setting | Value |
| --- | --- |
| Root directory | `terminal-portfolio` when the connected repository is `pweb` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` via `NODE_VERSION` or the included `.nvmrc` |

Leave the root directory blank if your repository contains only the contents of `terminal-portfolio/`. Cloudflare interprets the output directory relative to the selected project root. See the official [React deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/), [build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/), and [Node version configuration](https://developers.cloudflare.com/pages/configuration/build-image/). Pages’ Free plan currently includes 500 builds per month; this static app needs no Pages Functions or database. [Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

Alternatively, use **Cloudflare Workers Static Assets** with the included [`wrangler.jsonc`](wrangler.jsonc). It points to `dist/`, uses the project name `christina-portfolio`, and serves `index.html` for unmatched navigation paths. When you are ready to publish, run these commands from `terminal-portfolio/` and authenticate with your Cloudflare account when prompted:

```sh
npm run build
npx wrangler deploy
```

This command publishes the site; building and previewing locally do not. Cloudflare documents this workflow in [Static Assets setup](https://developers.cloudflare.com/workers/static-assets/get-started/). Requests served as static assets are free and unlimited, with no additional asset-storage charge; dynamic Worker execution has separate pricing. [Static Assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
