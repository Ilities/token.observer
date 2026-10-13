# Architecture

`token.observer` is a static, backend-free React single-page app that compares the real cost of
serving open-weight LLMs three ways: paying per token to a hosted API, renting a GPU by the
second, and running locally on owned hardware. All content lives in JSON files under
`src/data/`; there is no server, database, or API key required to run it.

## Stack

Versions are the ones actually pinned in `package.json`:

- React 19 (`react`, `react-dom`)
- React Router 7 (`react-router-dom`)
- Recharts 3 for charts
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Vite 8 with `@vitejs/plugin-react`, built and run through the Vite+ CLI (`vp`)

## Layout

```
.
├── index.html             # HTML shell; mounts #root, loads fonts, loads src/main.jsx
├── vite.config.js         # Build config + three closeBundle plugins
├── package.json           # Dependencies, scripts, packageManager (npm)
├── public/                # Copied verbatim into the build: favicon.svg, .nojekyll
├── scripts/
│   ├── update-prices.js   # Fetches provider pricing daily; writes prices.json + changelog
│   ├── README_PRICES.md   # Provider list and output schema for the script
│   └── price-changelog.json  # Rolling 30-day record of fetched price changes
├── .github/workflows/
│   ├── deploy.yml         # Builds on push to main, publishes to GitHub Pages
│   └── update-prices.yml  # Runs the price script daily and commits the result
├── AGENTS.md              # Vite+ toolchain instructions (CLAUDE.md is a symlink to it)
├── README.md              # Product pitch + setup
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Router, nav, route table, footer
    ├── index.css          # Tailwind import + design tokens and component classes
    ├── pages/             # One file per route
    ├── components/        # Nav, ModelCard, FrontierTimelineGraph
    └── data/              # JSON datasets + thin *.js wrappers and helpers
```

## Routes and pages

Defined in `src/App.jsx:74-81`:

| Path          | Page                                | What it shows                                                       |
| ------------- | ----------------------------------- | ------------------------------------------------------------------- |
| `/`           | `src/pages/Home.jsx`                | Hero, stat ticker, frontier graph, thesis, hardware guide, model grid |
| `/compare`    | `src/pages/Compare.jsx`             | Per-model API provider prices and self-host / rental options        |
| `/models`     | `src/pages/Models.jsx` (`ModelsList`)   | Model list plus a benchmarks tab                                |
| `/models/:id` | `src/pages/Models.jsx` (`ModelDetail`)  | Single-model detail page                                        |
| `/history`    | `src/pages/History.jsx`             | Gap-over-time charts and a "time machine" comparison                |
| `/about`      | `src/pages/About.jsx`               | Prose about the thesis and methodology                              |

Shared UI lives in `src/components/`: `Nav.jsx` (sticky header), `ModelCard.jsx` (card used on
Home and the Models list), and `FrontierTimelineGraph.jsx` (the Recharts scatter plot).

## Runtime flow

1. `index.html` loads `/src/main.jsx` (`index.html:22`).
2. `main.jsx` mounts `<App/>` into `#root` inside `StrictMode` (`src/main.jsx:6`).
3. `App` wraps the app in `BrowserRouter` (`src/App.jsx:88-93`); `AppContent` renders `<Nav/>`,
   the `<Routes>` table, and `<Footer/>` (`src/App.jsx:69-86`).
4. Each route's element reads its data from `src/data/`.
5. The `src/data/*.js` files are thin wrappers: they re-export a JSON file and add helpers that
   derive values (VRAM estimates, months behind the frontier, cost math). The JSON is the
   source of truth; the helpers are code.

## Where to start reading

- **Understand the product:** `src/App.jsx` → `src/pages/Home.jsx` → `src/components/ModelCard.jsx`.
- **Change a model or its prices:** `src/data/models.js` → `src/data/models.json` (the records),
  then the pages that render them: `src/pages/Compare.jsx` and `src/pages/Models.jsx`.
- **Hardware / frontier data:** `src/data/hardware.js` and `src/data/frontier.js`, consumed by
  the hardware section of `src/pages/Home.jsx` and by `src/components/FrontierTimelineGraph.jsx`.
- **Historical benchmarks:** `src/data/history.js` → `src/pages/History.jsx`.
- **Build and deployment:** `vite.config.js` and `.github/workflows/`.

## Known quirks

These are worth knowing before you trust an assumption about the codebase:

- **The "static HTML" step is route stubs, not prerendering.** `generateStaticHtml`
  (`vite.config.js:47-72`) copies the built `dist/index.html` to `compare.html`, `history.html`,
  etc. Those files contain the same empty `#root`; all rendering still happens in the browser.
- **Automated prices are not shown on the site.** `scripts/update-prices.js` writes
  `src/data/prices.json` (`scripts/update-prices.js:452`) and `scripts/price-changelog.json`
  (`:475`), but no page imports `prices.json`. The prices the UI displays come from
  `src/data/models.json`.
- **The script's `models.js` edit never fires.** `updateModelsFile`
  (`scripts/update-prices.js:351-374`) rewrites a `// All pricing data verified <Month> <Year>`
  comment, but `src/data/models.js:2` says `// Last updated: March 2026`, so the regex cannot
  match.
- **Some cost calculators are unused.** `compareOptions` (`src/data/models.js:36`) and
  `buildCostTable` (`:149`) are exported but not imported by any page; `Compare.jsx` computes
  from `model.apiProviders` directly.
- **Two CSS token systems coexist.** Most pages use the `--academia-*` tokens; `History.jsx`
  uses the legacy `--text` / `--surface` / `--accent` set (for example `src/pages/History.jsx:79`).
- **The README has drifted.** `README.md:20` says React 18 and `:22` says React Router v6, while
  `package.json` pins React 19 and React Router 7. `README.md:62` also says to edit
  `src/data/models.js`, but the model records now live in `src/data/models.json`.
