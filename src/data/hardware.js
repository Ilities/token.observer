// Hardware data imported from JSON
// Sources: Unsloth GGUF guide, llama.cpp, Artificial Analysis, vendor specs
// Last updated: March 2026

import data from "./hardware.json";

export const GGUF_SIZES = data.GGUF_SIZES;
export const HARDWARE_CATEGORIES = data.HARDWARE_CATEGORIES;
export const MODEL_VRAM_MAP = data.MODEL_VRAM_MAP;

// Helper functions
export function estimateVram(paramsB, quantType = "q4_k_m") {
  const bytesPerParam = GGUF_SIZES[quantType] || GGUF_SIZES.q4_k_m;
  return Math.ceil(paramsB * bytesPerParam * 1.2); // 20% overhead for KV cache
}

// Helper to check if model fits in category
export function modelFitsCategory(modelId, categoryId, quantType = "q4_k_m") {
  const model = MODEL_VRAM_MAP[modelId];
  const category = HARDWARE_CATEGORIES.find((c) => c.id === categoryId);
  if (!model || !category) return false;

  const maxTier = category.tiers[category.tiers.length - 1];
  const maxVram = parseInt(maxTier.vram);

  const requiredVram = estimateVram(model.params, quantType);
  return requiredVram <= maxVram;
}

// Get best model for category
export function getBestModelForCategory(categoryId) {
  const category = HARDWARE_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;
  return category.bestModel;
}

// Get all runnable models for category
export function getRunnableModels(categoryId, quantType = "q4_k_m") {
  const category = HARDWARE_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  return category.recommendedModels.filter((modelId) =>
    modelFitsCategory(modelId, categoryId, quantType),
  );
}
