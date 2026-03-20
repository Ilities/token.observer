# Price Update Script Documentation

## Overview

The `update-prices.js` script automatically fetches the latest API pricing data from multiple providers and updates the dataset used in the compare page.

## Supported Providers

### Public Endpoints (No Authentication Required)

These providers are fetched automatically without API keys:

1. **OpenRouter** - 300+ models, comprehensive aggregator
   - Endpoint: `https://openrouter.ai/api/v1/models`
   - Price format: `pricing.prompt` / `pricing.completion` (per token)

2. **DeepInfra** - 100+ open-source models
   - Endpoint: `https://api.deepinfra.com/v1/models`
   - Price format: `metadata.pricing.input_tokens` / `metadata.pricing.output_tokens` (per million)

3. **SambaNova** - Open-weight models
   - Endpoint: `https://api.sambanova.ai/v1/models`
   - Price format: `pricing.prompt` / `pricing.completion` (per token)

### Authenticated Endpoints (API Key Required)

These providers require API keys set as environment variables:

4. **Together AI** - 200+ models
   - Env: `TOGETHERAI_API_KEY`
   - Endpoint: `https://api.together.ai/v1/models`

5. **Fireworks AI** - Open-weight models
   - Env: `FIREWORKS_API_KEY`
   - Endpoint: `https://api.fireworks.ai/inference/v1/models`

6. **Hyperbolic** - Open-source LLMs
   - Env: `HYPERBOLIC_API_KEY`
   - Endpoint: `https://api.hyperbolic.xyz/v1/models`

7. **Novita AI** - Open-weight models
   - Env: `NOVITA_API_KEY`
   - Endpoint: `https://api.novita.ai/v3/model_instances`

8. **Groq** - Fast inference
   - Env: `GROQ_API_KEY`
   - Endpoint: `https://api.groq.com/openai/v1/models`

9. **Lepton AI** - Open-weight models
   - Env: `LEPTON_API_KEY`
   - Endpoint: `https://api.lepton.ai/api/v1/locations`

10. **Replicate** - Open-source models
    - Env: `REPLICATE_API_KEY`
    - Endpoint: `https://api.replicate.com/v1/models`

11. **FriendliAI** - Enterprise inference
    - Env: `FRIENDLI_API_KEY`
    - Endpoint: `https://api.friendli.ai/models`

12. **SiliconFlow** - Chinese models
    - Env: `SILICONFLOW_API_KEY`
    - Endpoint: `https://api.siliconflow.cn/v1/models`

## Usage

### Manual Execution

```bash
node scripts/update-prices.js
```

### GitHub Actions

The script runs automatically daily at 00:00 UTC via the workflow in `.github/workflows/update-prices.yml`.

### With API Keys

To enable authenticated providers, set environment variables:

```bash
export TOGETHERAI_API_KEY=your_key_here
export FIREWORKS_API_KEY=your_key_here
# ... etc

node scripts/update-prices.js
```

Or in GitHub Actions, add secrets:

- `TOGETHERAI_API_KEY`
- `FIREWORKS_API_KEY`
- `HYPERBOLIC_API_KEY`
- `NOVITA_API_KEY`
- `GROQ_API_KEY`
- `LEPTON_API_KEY`
- `REPLICATE_API_KEY`
- `FRIENDLI_API_KEY`
- `SILICONFLOW_API_KEY`

## Output Files

### `src/data/prices.json`

Contains the latest fetched prices:

```json
{
  "models": {
    "model-id": {
      "input": 0.15,
      "output": 0.6,
      "context": 128000,
      "source": "openrouter",
      "fetchedAt": "2026-03-20T00:00:00.000Z"
    }
  },
  "fetchedAt": "2026-03-20T00:00:00.000Z",
  "sources": {
    "openRouter": 323,
    "deepInfra": 79,
    "sambanova": 15
  }
}
```

### `scripts/price-changelog.json`

Tracks price changes over time (last 30 days):

```json
[
  {
    "date": "2026-03-20T00:00:00.000Z",
    "changes": [
      {
        "type": "updated",
        "model": "model-id",
        "oldPrice": { "input": 0.14, "output": 0.56 },
        "newPrice": { "input": 0.15, "output": 0.6 },
        "inputChange": "+7.14%",
        "outputChange": "+7.14%"
      }
    ]
  }
]
```

## API Providers in Models Data

The `src/data/models.js` file includes pricing from 15 providers for each model:

1. Alibaba Cloud
2. OpenRouter
3. DeepInfra
4. Groq
5. Hyperbolic
6. Fireworks
7. Together AI
8. Lepton AI
9. SambaNova
10. Novita
11. Replicate
12. FriendliAI
13. SiliconFlow
14. Anyscale
15. Cerebras

## Price Format

All prices are stored as **USD per million tokens** for both input and output.

## Troubleshooting

### "No pricing data fetched from any source"

- Check network connectivity
- Verify public endpoints are accessible
- For authenticated providers, ensure API keys are set

### Rate Limiting

The script handles rate limits with automatic retries (3 attempts with exponential backoff).

### Schema Changes

If a provider changes their API schema, update the `priceFormat` configuration in the `APIS` object at the top of the script.

## Adding New Providers

To add a new provider:

1. Add configuration to the `APIS` object:

   ```javascript
   newProvider: {
     base: "https://api.newprovider.com/v1",
     models: "https://api.newprovider.com/v1/models",
     priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
     scaleToPerM: true, // true if prices are per-token
     requiresAuth: false, // true if API key needed
   }
   ```

2. Add a fetch function:

   ```javascript
   async function fetchNewProvider() {
     return fetchProvider("newProvider", APIS.newProvider);
   }
   ```

3. Add to the main execution in `main()`

4. Update the provider list in models.js for each model

## License

This script is part of the token.observer project.
