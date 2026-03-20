// Frontier timeline data imported from JSON
// Sources: Artificial Analysis Intelligence Index, Vellum, LMSys
// Last updated: March 2026

import data from "./frontier.json";

export const HARDWARE_CATEGORIES = data.HARDWARE_CATEGORIES;
export const FRONTIER_TIMELINE = data.FRONTIER_TIMELINE;
export const OPEN_MODEL_CROSSOVERS = data.OPEN_MODEL_CROSSOVERS;

// Helper function to get frontier model by ID
export function getFrontierModel(id) {
  return FRONTIER_TIMELINE.find((m) => m.id === id);
}

// Helper to get open model crossover by model ID
export function getOpenModelCrossover(modelId) {
  return OPEN_MODEL_CROSSOVERS.find((c) => c.modelId === modelId);
}

// Get all crossovers for a hardware category
export function getCrossoversForCategory(categoryId) {
  return OPEN_MODEL_CROSSOVERS.filter((c) => c.hardwareCategory === categoryId);
}

// Calculate months between frontier date and current date
export function monthsBehind(frontierDate, currentDate = "2026-03") {
  const [fYear, fMonth] = frontierDate.split("-").map(Number);
  const [cYear, cMonth] = currentDate.split("-").map(Number);
  return (cYear - fYear) * 12 + (cMonth - fMonth);
}

// Get timeline data for chart
export function getTimelineData() {
  return FRONTIER_TIMELINE.map((model) => ({
    ...model,
    monthsBehind: monthsBehind(model.date),
    isFrontier: model.type === "closed" && model.intelligenceScore >= 90,
  }));
}

// Get the "climb" data - showing how open models progressed through hardware categories
export function getClimbData() {
  const climb = [];
  const categories = HARDWARE_CATEGORIES.sort((a, b) => a.yPosition - b.yPosition);

  categories.forEach((category) => {
    const crossovers = getCrossoversForCategory(category.id);
    crossovers.forEach((crossover) => {
      const frontierModel = getFrontierModel(crossover.frontierEquivalent);
      if (frontierModel) {
        climb.push({
          ...crossover,
          category,
          frontierModel,
          monthsBehind: monthsBehind(crossover.frontierDate),
        });
      }
    });
  });

  return climb.sort((a, b) => a.monthsBehind - b.monthsBehind);
}
