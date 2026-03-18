# model.observer

> Are AI models becoming a commodity? The math says yes.

An open investigation into the real cost of LLM inference:
**Local hardware vs rented cloud GPUs vs paying per token to Anthropic and friends.**

## What's inside

- **Crossover analysis** — at what throughput does self-hosting beat the API?
- **Per-minute/per-second GPU costs** vs per-token API pricing
- **Model viability tracker** — Qwen3.5 27B, Qwen3.5 122B, MiniMax M2.5
- **The commodity thesis** — open models are closing the gap fast

## Stack

- React 18
- Vite (static build → deploy anywhere)
- React Router v6
- Zero backend, zero tracking, zero API keys needed

## Setup

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run build      # static build → dist/
npm run preview    # preview production build
```

## Deploy

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

Drag `dist/` folder to netlify.com, or:

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# In vite.config.js, set base: '/your-repo-name/'
npm run build
# Push dist/ to gh-pages branch
```

## Adding models

Edit `src/data/models.js`. Each model needs:

- `apiProviders` — list of {name, input $/M, output $/M}
- `throughputs` — list of tps benchmarks, one with `crossover: true`
- `minGpu` — key from `GPU_CONFIGS`
- `verdict` — VIABLE / HARD / IMPRACTICAL

## Keeping prices current

Prices change fast. Sources to check:

- RunPod GPU pricing: https://runpod.io/pricing
- Artificial Analysis providers: https://artificialanalysis.ai
- OpenRouter model list: https://openrouter.ai/models
- DeepInfra pricing: https://deepinfra.com/pricing

## License

MIT — fork it, host it, build on it.

---

_Prices verified March 2026. This is not financial advice._
