#!/usr/bin/env node
/**
 * Daily Price Update Script for token.observer
 *
 * Fetches latest prices from various sources and updates the dataset.
 * Sources:
 * - OpenRouter API (300+ models, open-weight focus)
 * - DeepInfra API (100+ open-source models)
 * - SambaNova API (open-weight models)
 * - Together AI API (200+ models)
 * - Fireworks AI API (open-weight models)
 * - Novita AI API (open-weight models)
 * - Groq API (fast inference)
 * - Lepton AI API (open-weight models)
 * - Replicate API (open-source models)
 * - FriendliAI API (enterprise inference)
 * - SiliconFlow API (Chinese models)
 *
 * Run manually: node scripts/update-prices.js
 * Run via GitHub Actions: Daily at 00:00 UTC
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
// models.json is the data actually rendered by the UI (models.js only re-exports it).
const MODELS_FILE = join(ROOT_DIR, "src", "data", "models.json");
const PRICES_FILE = join(ROOT_DIR, "src", "data", "prices.json");
const CHANGELOG_FILE = join(ROOT_DIR, "scripts", "price-changelog.json");

// Maps the human-readable provider name used in models.json to the provider
// key (stored as `source`) used in prices.json.
const SOURCE_BY_PROVIDER_NAME = {
  OpenRouter: "openRouter",
  DeepInfra: "deepInfra",
  // Lowercase (not "sambaNova") because it must equal the fetcher's provider key
  // (see APIS.sambanova / fetchProvider("sambanova")) written to prices.json.
  SambaNova: "sambanova",
};

// Explicit, curated mapping from a models.json model id + provider display name
// to the provider-native slug used in prices.json. Providers/models that are
// not listed here are intentionally left with their curated value.
const MODEL_SLUG_MAP = {
  "qwen35-9b": {
    OpenRouter: "qwen/qwen3.5-9b",
    DeepInfra: "Qwen/Qwen3.5-9B",
  },
  "qwen35-27b": {
    OpenRouter: "qwen/qwen3.5-27b",
    DeepInfra: "Qwen/Qwen3.5-27B",
  },
  "qwen35-35b": {
    OpenRouter: "qwen/qwen3.5-35b-a3b",
    DeepInfra: "Qwen/Qwen3.5-35B-A3B",
  },
  "qwen35-122b": {
    OpenRouter: "qwen/qwen3.5-122b-a10b",
  },
  "glm-4.5-air": {
    OpenRouter: "z-ai/glm-4.5-air",
  },
  "glm-4.7": {
    OpenRouter: "z-ai/glm-4.7",
    DeepInfra: "zai-org/GLM-4.7",
  },
  "glm-4.7-flash": {
    OpenRouter: "z-ai/glm-4.7-flash",
  },
  "minimax-m25": {
    OpenRouter: "minimax/minimax-m2.5",
  },
  "minimax-m27": {
    OpenRouter: "minimax/minimax-m2.7",
    DeepInfra: "MiniMaxAI/MiniMax-M2.7-Turbo",
    SambaNova: "MiniMax-M2.7",
  },
  "deepseek-v3.2": {
    OpenRouter: "deepseek/deepseek-v3.2",
    DeepInfra: "deepseek-ai/DeepSeek-V3.2",
    SambaNova: "DeepSeek-V3.2",
  },
  "deepseek-r1": {
    OpenRouter: "deepseek/deepseek-r1",
    DeepInfra: "deepseek-ai/DeepSeek-R1-0528",
  },
  "kimi-k2": {
    OpenRouter: "moonshotai/kimi-k2",
  },
  "kimi-k2.5": {
    OpenRouter: "moonshotai/kimi-k2.5",
  },
  "glm-5": {
    OpenRouter: "z-ai/glm-5",
  },
  "glm-5.1": {
    OpenRouter: "z-ai/glm-5.1",
  },
};

// Reject junk values (e.g. negative or absurd prices) so they never reach the UI.
const MAX_PRICE_PER_M = 100000;

export function isValidPrice(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= MAX_PRICE_PER_M
  );
}

// API Endpoints for all providers
// Most follow OpenAI-compatible format with pricing.prompt and pricing.completion
const APIS = {
  // Primary aggregators (no auth required, most comprehensive)
  openRouter: {
    base: "https://openrouter.ai/api/v1",
    models: "https://openrouter.ai/api/v1/models",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true, // Prices are per token, need to multiply by 1M
  },
  deepInfra: {
    base: "https://api.deepinfra.com/v1",
    models: "https://api.deepinfra.com/v1/models",
    priceFormat: {
      input: "metadata.pricing.input_tokens",
      output: "metadata.pricing.output_tokens",
    },
    scaleToPerM: false, // Already per million
  },
  sambanova: {
    base: "https://api.sambanova.ai/v1",
    models: "https://api.sambanova.ai/v1/models",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true,
  },

  // Auth required (will use cached data or skip if no key)
  togetherAI: {
    base: "https://api.together.ai/v1",
    models: "https://api.together.ai/v1/models",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true,
    requiresAuth: true,
  },
  fireworks: {
    base: "https://api.fireworks.ai/inference/v1",
    models: "https://api.fireworks.ai/inference/v1/models",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true,
    requiresAuth: true,
  },
  novita: {
    base: "https://api.novita.ai/v3",
    models: "https://api.novita.ai/v3/model_instances",
    priceFormat: { input: "pricing.input_price", output: "pricing.output_price" },
    scaleToPerM: false,
    requiresAuth: true,
  },
  groq: {
    base: "https://api.groq.com/openai/v1",
    models: "https://api.groq.com/openai/v1/models",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true,
    requiresAuth: true,
  },
  lepton: {
    base: "https://api.lepton.ai/api/v1",
    models: "https://api.lepton.ai/api/v1/locations",
    priceFormat: { input: "pricing.prompt", output: "pricing.completion" },
    scaleToPerM: true,
    requiresAuth: true,
  },
  replicate: {
    base: "https://api.replicate.com/v1",
    models: "https://api.replicate.com/v1/models",
    priceFormat: { input: "pricing.input", output: "pricing.output" },
    scaleToPerM: false,
    requiresAuth: true,
  },
  friendli: {
    base: "https://api.friendli.ai",
    models: "https://api.friendli.ai/models",
    priceFormat: { input: "pricing.input", output: "pricing.output" },
    scaleToPerM: false,
    requiresAuth: true,
  },
  siliconflow: {
    base: "https://api.siliconflow.cn/v1",
    models: "https://api.siliconflow.cn/v1/models",
    priceFormat: { input: "pricing.input", output: "pricing.output" },
    scaleToPerM: false,
    requiresAuth: true,
  },
};

/**
 * Fetch data from URL with retry logic
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": "token.observer/1.0 (Price Update Bot)",
          ...options.headers,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} for ${url}`);
      await sleep(1000 * (i + 1));
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj, path) {
  if (!path || !obj) return undefined;
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

/**
 * Normalize model ID for matching across providers
 */
function normalizeModelId(id) {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/\s+/g, "");
}

/**
 * Extract prices from model data based on provider format
 */
function extractPrices(model, providerConfig) {
  const { priceFormat, scaleToPerM } = providerConfig;

  let inputPrice = getNestedValue(model, priceFormat.input);
  let outputPrice = getNestedValue(model, priceFormat.output);

  // Convert string prices to numbers
  if (typeof inputPrice === "string") inputPrice = parseFloat(inputPrice);
  if (typeof outputPrice === "string") outputPrice = parseFloat(outputPrice);

  // Scale to per-million if needed
  const scale = scaleToPerM ? 1_000_000 : 1;

  return {
    input: inputPrice ? inputPrice * scale : null,
    output: outputPrice ? outputPrice * scale : null,
  };
}

/**
 * Fetch from a generic OpenAI-compatible API endpoint
 */
async function fetchProvider(providerKey, providerConfig) {
  try {
    console.log(`Fetching from ${providerKey}...`);

    // Check if auth is required but not provided
    if (providerConfig.requiresAuth && !process.env[`${providerKey.toUpperCase()}_API_KEY`]) {
      console.log(`  Skipping ${providerKey}: No API key provided`);
      return null;
    }

    const headers = {};
    if (providerConfig.requiresAuth) {
      headers["Authorization"] = `Bearer ${process.env[`${providerKey.toUpperCase()}_API_KEY`]}`;
    }

    const data = await fetchWithRetry(providerConfig.models, { headers });

    const prices = {};
    const models = data?.data || data?.models || [];

    for (const model of models) {
      const { input, output } = extractPrices(model, providerConfig);
      if (input !== null && output !== null) {
        const modelId = model.id || model.name;
        prices[modelId] = {
          input: parseFloat(input.toFixed(4)),
          output: parseFloat(output.toFixed(4)),
          context: model.context_length || model.context_window,
          source: providerKey,
          fetchedAt: new Date().toISOString(),
        };
      }
    }

    console.log(`  Found ${Object.keys(prices).length} models with pricing`);
    return prices;
  } catch (error) {
    console.error(`Failed to fetch from ${providerKey}:`, error.message);
    return null;
  }
}

/**
 * Fetch OpenRouter model pricing (no auth required)
 */
async function fetchOpenRouter() {
  return fetchProvider("openRouter", APIS.openRouter);
}

/**
 * Fetch DeepInfra model pricing (no auth required)
 */
async function fetchDeepInfra() {
  return fetchProvider("deepInfra", APIS.deepInfra);
}

/**
 * Fetch SambaNova model pricing (no auth required)
 */
async function fetchSambaNova() {
  return fetchProvider("sambanova", APIS.sambanova);
}

/**
 * Fetch Together AI model pricing (auth required)
 */
async function fetchTogetherAI() {
  return fetchProvider("togetherAI", APIS.togetherAI);
}

/**
 * Fetch Fireworks AI model pricing (auth required)
 */
async function fetchFireworks() {
  return fetchProvider("fireworks", APIS.fireworks);
}

/**
 * Fetch Novita AI model pricing (auth required)
 */
async function fetchNovita() {
  return fetchProvider("novita", APIS.novita);
}

/**
 * Fetch Groq model pricing (auth required)
 */
async function fetchGroq() {
  return fetchProvider("groq", APIS.groq);
}

/**
 * Fetch Lepton AI model pricing (auth required)
 */
async function fetchLepton() {
  return fetchProvider("lepton", APIS.lepton);
}

/**
 * Fetch Replicate model pricing (auth required)
 */
async function fetchReplicate() {
  return fetchProvider("replicate", APIS.replicate);
}

/**
 * Fetch FriendliAI model pricing (auth required)
 */
async function fetchFriendli() {
  return fetchProvider("friendli", APIS.friendli);
}

/**
 * Fetch SiliconFlow model pricing (auth required)
 */
async function fetchSiliconFlow() {
  return fetchProvider("siliconflow", APIS.siliconflow);
}

/**
 * Compare prices and generate changelog
 */
function comparePrices(oldPrices, newPrices) {
  const changes = [];

  if (!oldPrices || !newPrices) return changes;

  for (const [modelId, newPrice] of Object.entries(newPrices)) {
    const oldPrice = oldPrices[modelId];
    if (!oldPrice) {
      changes.push({
        type: "new",
        model: modelId,
        newPrice,
        timestamp: new Date().toISOString(),
      });
      continue;
    }

    if (oldPrice.input !== newPrice.input || oldPrice.output !== newPrice.output) {
      const inputChange = (((newPrice.input - oldPrice.input) / oldPrice.input) * 100).toFixed(2);
      const outputChange = (((newPrice.output - oldPrice.output) / oldPrice.output) * 100).toFixed(
        2,
      );

      changes.push({
        type: "updated",
        model: modelId,
        oldPrice,
        newPrice,
        inputChange: `${inputChange > 0 ? "+" : ""}${inputChange}%`,
        outputChange: `${outputChange > 0 ? "+" : ""}${outputChange}%`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return changes;
}

/**
 * Apply fetched prices to the curated models data (in memory).
 *
 * Only entries with an explicit mapping are touched. A mapped entry is left
 * with its curated value when the fetched slug is missing or its values fail
 * validation, so the UI never renders junk.
 *
 * @returns {{updated:number, skipped:number, unmapped:number, updatedModelIds:string[]}}
 */
export function applyPricesToData(data, newPrices) {
  const result = { updated: 0, skipped: 0, unmapped: 0, updatedModelIds: [] };

  const fetchedBySource = {};
  for (const [slug, entry] of Object.entries(newPrices?.models || {})) {
    if (!entry?.source) continue;
    (fetchedBySource[entry.source] ||= {})[slug] = entry;
  }

  for (const model of data?.MODELS || []) {
    const slugMap = MODEL_SLUG_MAP[model.id];
    if (!slugMap) continue;

    let modelUpdated = false;
    for (const provider of model.apiProviders || []) {
      const slug = slugMap[provider.name];
      if (!slug) {
        result.unmapped++;
        continue;
      }

      const source = SOURCE_BY_PROVIDER_NAME[provider.name];
      const entry = source ? fetchedBySource[source]?.[slug] : undefined;
      if (!entry || !isValidPrice(entry.input) || !isValidPrice(entry.output)) {
        result.skipped++;
        continue;
      }

      provider.input = entry.input;
      provider.output = entry.output;
      result.updated++;
      modelUpdated = true;
    }

    if (modelUpdated) result.updatedModelIds.push(model.id);
  }

  return result;
}

/**
 * Find the index of the bracket matching the one at `openIdx` in a JSON string,
 * ignoring brackets that appear inside strings.
 */
function findMatchingBracket(text, openIdx) {
  const open = text[openIdx];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = openIdx; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close && --depth === 0) return i;
  }

  return -1;
}

/**
 * Rewrite the apiProviders array for each changed model, preserving the rest of
 * the file (and therefore keeping diffs limited to the prices that changed).
 */
function patchModelsFile(raw, data, updatedModelIds) {
  let patched = raw;

  for (const modelId of updatedModelIds) {
    const model = data.MODELS.find((m) => m.id === modelId);
    const idIdx = patched.indexOf(`"id": "${modelId}"`);
    if (idIdx === -1) continue;

    const apiKeyIdx = patched.indexOf('"apiProviders"', idIdx);
    if (apiKeyIdx === -1) continue;

    const arrStart = patched.indexOf("[", apiKeyIdx);
    const arrEnd = findMatchingBracket(patched, arrStart);
    if (arrStart === -1 || arrEnd === -1) continue;

    const serialized = JSON.stringify(model.apiProviders, null, 2)
      .split("\n")
      .map((line, i) => (i === 0 ? line : `      ${line}`))
      .join("\n");

    patched = patched.slice(0, arrStart) + serialized + patched.slice(arrEnd + 1);
  }

  return patched;
}

/**
 * Update src/data/models.json (the file the UI actually renders) with new prices.
 */
export function applyPricesToModels(newPrices, modelsFile = MODELS_FILE) {
  if (!existsSync(modelsFile)) {
    console.error("models.json not found!");
    return { updated: 0, skipped: 0, unmapped: 0, updatedModelIds: [] };
  }

  const raw = readFileSync(modelsFile, "utf8");
  const data = JSON.parse(raw);
  const result = applyPricesToData(data, newPrices);

  if (result.updated > 0) {
    writeFileSync(modelsFile, patchModelsFile(raw, data, result.updatedModelIds));
  }

  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log("🚀 Starting price update...\n");

  // Load existing prices
  let oldPrices = {};
  if (existsSync(PRICES_FILE)) {
    try {
      oldPrices = JSON.parse(readFileSync(PRICES_FILE, "utf8"));
      console.log("Loaded existing prices from prices.json");
    } catch (e) {
      console.log("No existing prices file, starting fresh");
    }
  }

  // Fetch from all sources (parallel for non-auth, sequential for auth to avoid rate limits)
  console.log("📡 Fetching from public endpoints (no auth required)...\n");
  const [openRouter, deepInfra, sambanova] = await Promise.all([
    fetchOpenRouter(),
    fetchDeepInfra(),
    fetchSambaNova(),
  ]);

  console.log("\n📡 Fetching from authenticated endpoints...\n");
  const [togetherAI, fireworks, novita, groq, lepton, replicate, friendli, siliconflow] =
    await Promise.all([
      fetchTogetherAI(),
      fetchFireworks(),
      fetchNovita(),
      fetchGroq(),
      fetchLepton(),
      fetchReplicate(),
      fetchFriendli(),
      fetchSiliconFlow(),
    ]);

  // Combine results from all providers
  const allPrices = {
    ...openRouter,
    ...deepInfra,
    ...sambanova,
    ...togetherAI,
    ...fireworks,
    ...novita,
    ...groq,
    ...lepton,
    ...replicate,
    ...friendli,
    ...siliconflow,
  };

  // Filter out null results
  const newPrices = {
    models: Object.fromEntries(Object.entries(allPrices).filter(([_, v]) => v !== null)),
    fetchedAt: new Date().toISOString(),
    sources: {
      openRouter: openRouter ? Object.keys(openRouter).length : 0,
      deepInfra: deepInfra ? Object.keys(deepInfra).length : 0,
      sambanova: sambanova ? Object.keys(sambanova).length : 0,
      togetherAI: togetherAI ? Object.keys(togetherAI).length : 0,
      fireworks: fireworks ? Object.keys(fireworks).length : 0,
      novita: novita ? Object.keys(novita).length : 0,
      groq: groq ? Object.keys(groq).length : 0,
      lepton: lepton ? Object.keys(lepton).length : 0,
      replicate: replicate ? Object.keys(replicate).length : 0,
      friendli: friendli ? Object.keys(friendli).length : 0,
      siliconflow: siliconflow ? Object.keys(siliconflow).length : 0,
    },
  };

  const totalModels = Object.keys(newPrices.models).length;
  console.log(`\n💾 Fetched prices for ${totalModels} unique models`);

  // Save new prices
  writeFileSync(PRICES_FILE, JSON.stringify(newPrices, null, 2));
  console.log("💾 Saved new prices to prices.json");

  // Generate changelog
  const changes = comparePrices(oldPrices.models, newPrices.models);

  if (changes.length > 0) {
    // Load existing changelog
    let changelog = [];
    if (existsSync(CHANGELOG_FILE)) {
      changelog = JSON.parse(readFileSync(CHANGELOG_FILE, "utf8"));
    }

    // Prepend new changes
    changelog.unshift({
      date: new Date().toISOString(),
      changes,
    });

    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    changelog = changelog.filter((entry) => new Date(entry.date).getTime() > thirtyDaysAgo);

    writeFileSync(CHANGELOG_FILE, JSON.stringify(changelog, null, 2));
    console.log(`📝 Recorded ${changes.length} price changes`);

    // Print summary
    console.log("\n📊 Changes summary:");
    for (const change of changes) {
      if (change.type === "new") {
        console.log(`  + ${change.model}: NEW`);
      } else {
        console.log(
          `  ~ ${change.model}: Input ${change.inputChange}, Output ${change.outputChange}`,
        );
      }
    }
  } else {
    console.log("✅ No price changes detected");
  }

  // Apply fetched prices to the file the UI actually renders (models.json)
  const applied = applyPricesToModels(newPrices);

  console.log("\n✨ Price update complete!");

  // Print source summary
  console.log("\n📊 Sources summary:");
  for (const [source, count] of Object.entries(newPrices.sources)) {
    if (count > 0) {
      console.log(`  ${source}: ${count} models`);
    }
  }

  // Report how many rendered prices changed (even when zero) so a refresh that
  // changes nothing is visible at the end of the run.
  console.log(
    `\n📈 Model prices updated: ${applied.updated} provider price(s) across ${applied.updatedModelIds.length} model(s) in models.json`,
  );
  if (applied.updated > 0) {
    console.log(`   (updated models: ${applied.updatedModelIds.join(", ")})`);
  }

  // Exit with error if no data fetched (for CI)
  if (totalModels === 0) {
    console.error("⚠️ Warning: No pricing data fetched from any source");
    process.exit(1);
  }

  // Guardrail: a run that changes nothing in the rendered dataset must fail loudly
  // rather than report success like the old no-op did.
  if (applied.updated === 0) {
    console.error(
      "⚠️ Warning: No curated model prices were updated — models.json is unchanged",
    );
    process.exit(1);
  }
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  // Run
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
