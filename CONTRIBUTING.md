# Contributing to token.observer

Thanks for wanting to help! token.observer is an open investigation into the
real cost of LLM inference — local hardware vs rented cloud GPUs vs paying per
token. All contributions are welcome: code, reports, data, and ideas.

## Prerequisites

- **Node.js 20** (what CI uses — see `.github/workflows/deploy.yml`)
- **npm** (the project is pinned to `npm@11.11.1` via `packageManager`)

## Local setup

```bash
npm install
npm run dev        # dev server at localhost:5173
```

For the production build and a preview of it:

```bash
npm run build      # static build → dist/
npm run preview    # preview production build
```

## Checks before opening a PR

- Run `npm run build` and make sure it completes without errors.
- Sanity-check the result with `npm run preview`.
- Smoke-test your change in the dev server (`npm run dev`) before and after.

There is currently **no automated test suite** in this repo, so a working build
plus a quick manual check of the pages you touched is the bar for review. If the
Vite+ (`vp`) toolchain documented in `AGENTS.md` is available in your
environment, `vp check` and `vp test` are useful extras, but `npm run build` is
the check that matters.

## Commit and PR conventions

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`,
  `fix:`, `docs:`, `chore:`.
- One focused change per PR, with a descriptive title.
- Reference the issue your PR fixes in the description.
- Don't hand-edit the price data — `src/data/prices.json` and
  `scripts/price-changelog.json` are regenerated automatically by the daily
  `update-prices` workflow (commits like `chore: update prices YYYY-MM-DD`).

## What to contribute

- **Bug reports / feature requests** — open an issue first using the templates
  in `.github/ISSUE_TEMPLATE`.
- **New or updated models** — edit `src/data/models.js`; each model needs an
  `apiProviders` list, `throughputs`, a `minGpu` key, and a `verdict`. See the
  "Adding models" section of the README.
- **Price pipeline changes** — see `scripts/README_PRICES.md`.
- **UI / infra** — components live in `src/components`, pages in `src/pages`.

## Code of conduct

Be respectful, assume good faith, and focus feedback on the work, not the
person. Harassment or personal attacks have no place here.

## License

token.observer is MIT — fork it, host it, build on it. By contributing you agree
your contribution is licensed under the same MIT license.