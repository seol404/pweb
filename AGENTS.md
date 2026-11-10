# AGENTS.md

Handoff notes for any coding agent picking up this repo. Read this first, then update the "Current state" and "Next steps" sections before you stop.

## What this is

Christina Lee's personal portfolio site: a single-page site themed like a Linux desktop/terminal. Visitors can type commands into a fake shell (`ls`, `cd`, `cat`, `open`, `neofetch`, `theme`, and so on) or click folders in a file-explorer view. It's fully static. The shell only navigates portfolio content in the browser and never runs real OS commands.

- **Stack:** React 19 + Vite 7, plain CSS, JetBrains Mono (via `@fontsource-variable`). No router and no backend.
- **Node:** 22.12 or newer (`.nvmrc` says `22`).
- **Deploy target:** Cloudflare Workers Static Assets via `wrangler.jsonc`. It serves `./dist` with SPA fallback, and the worker name is `christina-portfolio`. Not deployed yet.

## Layout

| Path | Purpose |
| --- | --- |
| `src/content.js` | All portfolio copy: profile, experiences, projects, skills, education. Edit content here. |
| `src/terminal.js` | Virtual shell: path resolution, tokenizer, `executeCommand`, tab completion, help text. Pure functions, no React. |
| `src/terminal.test.js` | Unit tests for the shell (`node --test`). |
| `src/App.jsx` | All UI components (icons, sections, output rendering, theme, keyboard shortcuts). |
| `src/App.css` | All styling, including light and dark themes. |
| `src/main.jsx` | React entry point. |
| `public/_headers` | Security headers (strict CSP) and immutable caching for `/assets/*`. |
| `public/resume.pdf` | Downloadable résumé. **It includes a phone number**, and the site's displayed contact info intentionally omits it. For that reason it's **gitignored**, so a fresh clone won't have it and `open resume` will 404. Get a phone-free PDF from the owner before deploying, and only then un-ignore it. |
| `public/favicon.svg`, `public/robots.txt` | Static assets. |
| `tests/portfolio.spec.js` | Playwright end-to-end tests (desktop project, plus mobile tests tagged `@mobile`). |
| `playwright.config.js` | Builds, then serves the preview on port 4173. Uses local Chrome unless `CI` is set. |

`build/` is a leftover from an old Create React App setup and is gitignored. `dist/`, `node_modules/`, `test-results/`, and `.npm-cache/` are gitignored too.

## Commands

```sh
npm ci
npm run dev        # http://127.0.0.1:5173
npm run build      # writes to dist/
npm run preview    # http://127.0.0.1:4173
npm test           # shell unit tests
npm run test:e2e   # Playwright (builds first)
npx wrangler deploy  # publishes to Cloudflare (only when the owner says so)
```

## Current state (2026-11-09)

- The app is functional. `npm test` passes all 7 tests. E2E tests were not re-run during this handoff.
- The project used to live in `pweb/terminal-portfolio/` and was just flattened into the repo root. The two `.gitignore` files were merged.
- **The README is stale after the flattening.** It still says `cd terminal-portfolio` and "run from `terminal-portfolio/`", and the Cloudflare Pages table lists `terminal-portfolio` as the root directory. Those should now point at the repo root. It also documents both Pages and Workers. Workers is the chosen path.
- **Main ongoing work: "un-AI-slopping" the site.** The owner thinks the current copy and design read as generic and AI-generated, and wants them to sound and look like a real person made them. A project skill for this is coming, so check `.claude/skills/` (or wherever it lands) and follow it when it exists. Until then, apply these working guidelines:
  - Copy in `src/content.js` and the README: drop filler, marketing tone, em-dash-heavy phrasing, and triads like "from X and Y to Z". Keep the facts.
  - UI: avoid generic gradients, glows, and over-decorated cards. Lean into an authentic Linux terminal/desktop feel.
  - Don't invent résumé facts. Every claim must come from `public/resume.pdf` or the owner.

## Next steps

1. Un-slop the copy and visuals (follow the incoming skill).
2. Fix the stale `terminal-portfolio` paths in the README, and decide whether to drop the Cloudflare Pages section.
3. Other owner-requested changes (TBD; ask the owner).
4. Run `npm test` and `npm run test:e2e`, and update the tests if UI text changes.
5. Deploy with `npm run build && npx wrangler deploy`, but only when the owner explicitly asks.

## Conventions

- Keep the shell logic in `terminal.js` pure and covered by `terminal.test.js`. Add a test for each new command.
- Keep `public/_headers` CSP-compatible: no inline scripts and no third-party origins. Any new external resource needs a CSP update.
- Don't commit or push unless the owner asks. Never run `wrangler deploy` on your own.
- Update this file before you stop.
