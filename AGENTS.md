# AGENTS.md

Handoff notes for any coding agent picking up this repo. Read this first, then update the "Current state" and "Next steps" sections before you stop.

## What this is

Christina Lee's personal portfolio site: a single-page site themed like a Linux desktop/terminal. Visitors can type commands into a fake shell (`ls`, `cd`, `cat`, `open`, `neofetch`, `theme`, and so on) or click folders in a file-explorer view. It's fully static. The shell only navigates portfolio content in the browser and never runs real OS commands.

- **Stack:** React 19 + Vite 7, plain CSS. No router and no backend.
- **Font:** Departure Mono, a pixel monospace font. It's self-hosted from `src/fonts/` under the SIL OFL license, and its license file must stay next to the font. It's only crisp at multiples of 11px, so the type scale is 11 / 22 / 33 / 44. The one exception is the 16px mobile input, which stops iOS from zooming on focus. There's a single weight, so hierarchy comes from size and color.
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

- The app is functional. `npm test` passes 7/7 and `npm run test:e2e` passes 19/19. Everything is committed and pushed to `origin/main`. It hasn't been deployed yet.
- **First unslop pass is done.** It used the `unslop` skill (the user-level one at `~/.claude/skills/unslop`; `.claude/skills/unslop/SKILL.md` in this repo is an empty stub the owner plans to fill). The direction was:
  - **World:** a real Linux session. No macOS traffic lights.
  - **Character:** exact, dry, a little playful.
  - **Moment:** the home screen is `neofetch` output (Tux, info rows, ANSI swatches), followed by an `ls -l`-style directory list.
  - **Signature:** the prompt line above each output. Sections have no eyebrow labels.
  - **Color:** green is only for the prompt user, the active item, the current role and neofetch keys. Blue is for directories and paths. There are three text roles: `--bright`, `--text` and `--muted`.
  - **Chrome:** three layers (top bar, window, status line). All the "curious" taglines were cut.
  - **Spacing and type:** everything is on a 4px grid. Type is Departure Mono at 11 / 22 / 33 / 44px, in one weight (see Font above).
  - **Motion** (inspired by toss.im, translated into terminal behavior):
    - New output prints in block by block (`.print-in`, a 28ms stagger with a 4px rise; the selector list is `printLines` in `App.jsx`).
    - Clicking a folder types the command into the prompt before running it (`typeAndRun`). Any key press or manual edit cancels it.
    - The sidebar highlight slides between folders (`.tree-indicator`).
    - Clicking a section already in the log jumps to it instead of appending a copy (`navigate`).
    - All of it turns off under `prefers-reduced-motion`. No scroll-jacking, blur, parallax or looping animation.
  - **Art gallery:** the 10 pieces were cropped out of the owner's portfolio PDF into `public/art/NN.webp` (full) and `NN-thumb.webp` (192px tall). They're listed in `artworks` in `content.js`; the alt text describes the subject only, and media per piece is unknown. The Art hobby opens `ArtViewer`, a modal `<dialog>` with a snap-scrolling track, previous/next buttons, a thumbnail strip, and arrow keys/Esc. They're meant to be public.
  - **Contact:** GitHub, LinkedIn and Substack only. No email and no résumé, on purpose.
  - **Copy:** it's dry on purpose. Headings are plain ("Experience"), and the only jokes are the shell ones (the sudo message, neofetch). Don't add slogans back.
- The project used to live in `pweb/terminal-portfolio/` and was flattened into the repo root. The README is up to date and documents only the Workers deploy.
- **Keep the site un-slopped.** The owner doesn't want it to read as generic or AI-generated. Follow the `unslop` skill when it's available, and apply these guidelines:
  - Copy in `src/content.js` and the README: drop filler, marketing tone, em-dash-heavy phrasing, and triads like "from X and Y to Z". Keep the facts.
  - UI: avoid generic gradients, glows, and over-decorated cards. Lean into an authentic Linux terminal/desktop feel.
  - Don't invent résumé facts. Every claim must come from the owner or what's already in `src/content.js`. The site deliberately has **no résumé download**, so don't add one back.

## Next steps

1. Other owner-requested changes (TBD; ask the owner).
2. Decide whether `public/portfoliosite.pdf` stays. The gallery replaced it, and nothing links to it now.
3. Run `npm test` and `npm run test:e2e`, and update the tests if UI text changes.
4. Deploy with `npm run build && npx wrangler deploy`, but only when the owner explicitly asks.

## Conventions

- Keep the shell logic in `terminal.js` pure and covered by `terminal.test.js`. Add a test for each new command.
- Keep `public/_headers` CSP-compatible: no inline scripts and no third-party origins. Any new external resource needs a CSP update.
- Don't commit or push unless the owner asks. Never run `wrangler deploy` on your own.
- Update this file before you stop.
