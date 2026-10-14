# Data model and content reference

Every piece of content on the site lives in a JSON file under `src/data/`. Each dataset has a
matching `*.js` wrapper that re-exports the JSON and adds helper functions. Pages never import
the JSON directly — they import from the wrapper (for example
`import { SORTED_MODELS, TIERS } from "../data/models"`). The JSON is the source of truth for
data; the `.js` file is the source of truth for logic.

## Wrapper convention

For a dataset `foo`:

- `src/data/foo.json` holds the raw records.
- `src/data/foo.js` does `import data from "./foo.json"` and exports named constants plus any
  helper functions.

To change data, edit the JSON. To change behaviour (filters, derived values), edit the `.js`.

## Datasets

### models — `models.json` → `models.js`

**Exports:** `TIERS`, `GPU_CONFIGS`, `MODELS`, `SORTED_MODELS` (a copy of `MODELS` sorted by
`name`), `USAGE_PROFILES`, `THESIS_POINTS` (`models.js:6-11`).

**`MODELS[]` record shape:**

| Field             | Type   | Notes                                                        |
| ----------------- | ------ | ------------------------------------------------------------ |
| `id`              | string | kebab-case; used in `/models/:id` URLs and cross-file lookups |
| `tier`            | string | key into `TIERS` (`top`, `mid`, `fast`)                      |
| `name`, `family`  | string | display name / family                                        |
| `type`            | string | `"MoE"` or dense                                             |
| `totalParams`, `activeParams` | string | human-readable (e.g. `"122B"`)                    |
| `releaseDate`, `license`, `context`, `architecture` | string | metadata          |
| `closestApi`      | string | the closed model it competes with                            |
| `verdict`         | string | `VIABLE` / `HARD` / `IMPRACTICAL`                            |
| `verdictNote`     | string | prose explanation                                            |
| `benchmarks`      | object | `{ mmlu, mmluPro, swebench, gpqa, livecodebench, arena }`    |
| `apiProviders`    | array  | `{ name, input, output, note? }`, USD per million tokens     |
| `purchaseOptions` | array  | `{ name, totalVram, purchaseCost, usedCost, monthlyElectricity, canRunModel, quality }` |
| `rentalOptions`   | array  | `{ name, costPerHr, costPerDay24, provider }`                |

**Supporting constants:**

- `TIERS` — keyed by `top` / `mid` / `fast`; each `{ id, label, description, useCases,
  closedApiEquivalent, closedApiCost: { input, output }, closedApiName, color }`. The
  `closedApiCost` is what the "tier equivalent" comparisons price against.
- `USAGE_PROFILES[]` — `{ id, label, description, tokensPerDay, hoursActivePerDay, examples }`;
  the input for the cost calculators.
- `GPU_CONFIGS` — keyed by GPU id (`rtx4090`, `h100`, …); `{ name, vram, costPerHr, provider,
  notes }`.
- `THESIS_POINTS[]` — `{ id, title, body }` (`Home.jsx` does not use these; it defines its own
  `THESIS_POINTS` inline at `src/pages/Home.jsx:47`).

**Helpers:** `monthlyApiCost` (`models.js:17`), `monthlyRentalCost` (`:26`),
`paybackMonths` (`:30`), `compareOptions` (`:36`), `buildCostTable` (`:149`).

**Exported but unused:** `GPU_CONFIGS` and `THESIS_POINTS` are referenced nowhere; the
calculators `compareOptions` and `buildCostTable` (and therefore `USAGE_PROFILES`) are exported
but not imported by any page — `Compare.jsx` reads `model.apiProviders` directly.

**Consumers:** `src/pages/Home.jsx`, `src/pages/Compare.jsx`, `src/pages/Models.jsx`,
`src/components/ModelCard.jsx`, and `src/pages/History.jsx` (which imports `MODELS` as
`CURRENT_MODELS`).

### hardware — `hardware.json` → `hardware.js`

**Exports:** `GGUF_SIZES`, `HARDWARE_CATEGORIES`, `MODEL_VRAM_MAP` (`hardware.js:7-9`).

- `GGUF_SIZES` — quantization key (`q2_k` … `q8_0`) → bytes per parameter.
- `MODEL_VRAM_MAP` — hardware model id → `{ params, family }`.
- `HARDWARE_CATEGORIES[]` — `{ id, name, icon, description, tiers[], bestQuant,
  maxPracticalParams, recommendedModels[], bestModel, notes }`, where each `tiers[]` entry is
  `{ name, vram, systemRam, bandwidth, examples[], tdp }`.

**Helpers:** `estimateVram` (`hardware.js:12`), `modelFitsCategory` (`:18`),
`getBestModelForCategory` (`:31`), `getRunnableModels` (`:38`).

**Consumers:** the hardware section of `src/pages/Home.jsx` (it uses `HARDWARE_CATEGORIES`,
`MODEL_VRAM_MAP`, `GGUF_SIZES`, and `estimateVram`).

> Note: `frontier.json` has its **own** `HARDWARE_CATEGORIES` with a different shape
> (`{ id, name, icon, description, maxVram, color, yPosition }`). The two are not the same
> object and are not kept in sync automatically.

### frontier — `frontier.json` → `frontier.js`

**Exports:** `HARDWARE_CATEGORIES`, `FRONTIER_TIMELINE`, `OPEN_MODEL_CROSSOVERS`
(`frontier.js:7-9`).

- `FRONTIER_TIMELINE[]` — `{ id, name, family, date, intelligenceScore, type, note }`, where
  `type` is `"closed"` or `"open"` and `date` is `YYYY-MM`.
- `OPEN_MODEL_CROSSOVERS[]` — `{ modelId, modelName, hardwareCategory, frontierEquivalent,
  frontierDate, frontierScore, modelScore, note }`; `hardwareCategory` joins to this file's
  `HARDWARE_CATEGORIES`, `frontierEquivalent` joins to `FRONTIER_TIMELINE[].id`.

**Helpers:** `getFrontierModel` (`frontier.js:12`), `getOpenModelCrossover` (`:17`),
`getCrossoversForCategory` (`:22`), `monthsBehind` (`:27`, relative to a hardcoded
`"2026-03"`), `getTimelineData` (`:34`), `getClimbData` (`:43`).

**Consumers:** `src/components/FrontierTimelineGraph.jsx`.

### history — `history.json` → `history.js`

**Exports:** `HISTORICAL_MODELS`, `BENCHMARK_INFO` (`history.js:7-8`).

- `HISTORICAL_MODELS[]` — `{ id, name, family, organization, type, releaseDate, benchmarks }`
  (87 records). Benchmarks here are the set `{ mmlu, mmluPro, swebench, gpqa, humanEval, arena }`,
  which differs from `models.json` (that set uses `livecodebench` instead of `humanEval`).
- `BENCHMARK_INFO` — benchmark key → `{ name, fullName, description, max }`.

**Helpers:** `getFrontierModels` (`history.js:11`), `getOpenModels` (`:15`),
`getModelsByFamily` (`:19`), `getBestScoreByDate` (`:23`), `calculateGap` (`:39`),
`getGapHistory` (`:57`, uses hardcoded quarterly dates from `2023-03` to `2026-03`),
`findHistoricalMatches` (`:78`), `getOpenModelComparisons` (`:128`),
`getTimeMachineComparison` (`:140`).

**Consumers:** `src/pages/History.jsx`.

### prices — `prices.json` (no wrapper)

Shape: `{ models: { "<provider model id>": { input, output, context, source, fetchedAt } },
fetchedAt, sources }`. Written by `scripts/update-prices.js`; **not imported by any page** (see
"Price data gap" below).

## Which file feeds which page

| Data file            | Consumed by                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `models.json`        | `Home.jsx`, `Compare.jsx`, `Models.jsx`, `ModelCard.jsx`, `History.jsx` |
| `hardware.json`      | `Home.jsx` (hardware section)                                      |
| `frontier.json`      | `FrontierTimelineGraph.jsx` (rendered on `Home.jsx`)               |
| `history.json`       | `History.jsx`                                                      |
| `prices.json`        | nothing (written by the update script only)                        |

## Adding a model

1. Add a record to `MODELS` in `src/data/models.json`.
2. Add a matching entry to `MODEL_VRAM_MAP` in `src/data/hardware.json` (this is what the Home
   hardware section looks up).
3. Optionally add the id to a `HARDWARE_CATEGORIES[].recommendedModels` list.
4. If the model needs historical or frontier context, add it to `history.json` /
   `frontier.json` too.

`README.md:62` still says to edit `src/data/models.js`; the model records now live in
`src/data/models.json`.

## Data integrity contract and caveats

The files cross-reference each other by id, and those ids are **not** aligned:

- A model shown in a hardware category must exist in **both** `models.json` (`MODELS`) and
  `hardware.json` (`MODEL_VRAM_MAP`). `getCategoryModelDetails` in `src/pages/Home.jsx:567-588`
  looks up both and silently drops any id missing from either (`:572`, `.filter(Boolean)` at
  `:586`).
- The two id sets already diverge: `MODEL_VRAM_MAP` has entries with no `MODELS` record (for
  example `gpt-oss-120b`, `qwen35-235b`, `nemotron-ultra-253b`), and naming differs for others
  (`minimax-m2.5` in the map vs `minimax-m25` in `MODELS`). As a result, many
  `recommendedModels` entries never render.
- Three categories name a `bestModel` that has no `MODELS` record (`unified-memory`,
  `inference-cards` → `qwen35-235b`; `smb-inference` → `qwen35-397b`). The "View Best Model"
  link (`Home.jsx:907`) then points at `/models/<missing-id>` and `ModelDetail` shows
  "Model not found", while the best-model highlight box is skipped.

Whoever adds or renames a model must update **all** of `models.json`, `hardware.json`
(`MODEL_VRAM_MAP`, `recommendedModels`, `bestModel`), and — where relevant — `history.json` /
`frontier.json`.

## Price data gap

`scripts/update-prices.js` fetches live provider pricing daily and writes
`src/data/prices.json` (`scripts/update-prices.js:452`) plus `scripts/price-changelog.json`
(`:475`). But `prices.json` has no wrapper and no importer, and the prices the UI displays come
from the hand-maintained `apiProviders` arrays in `src/data/models.json`. The script's attempt
to touch `models.js` (`updateModelsFile`, `scripts/update-prices.js:351-374`) looks for a
`// All pricing data verified <Month> <Year>` comment that does not exist (`models.js:2` says
`// Last updated: March 2026`), so it is a no-op. In short: automated price data is currently
collected but not surfaced on the site.
