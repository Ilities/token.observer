// Historical LLM benchmark data imported from JSON
// Sources: Artificial Analysis, Vellum, LMSys, official model cards
// Last updated: March 2026

import data from "./history.json";

export const HISTORICAL_MODELS = data.HISTORICAL_MODELS;
export const BENCHMARK_INFO = data.BENCHMARK_INFO;

// Helper functions
export function getFrontierModels() {
  return HISTORICAL_MODELS.filter((m) => m.type === "closed");
}

export function getOpenModels() {
  return HISTORICAL_MODELS.filter((m) => m.type === "open");
}

export function getModelsByFamily(family) {
  return HISTORICAL_MODELS.filter((m) => m.family === family);
}

export function getBestScoreByDate(date, benchmark, type = "all") {
  const cutoff = new Date(date);
  const models = HISTORICAL_MODELS.filter(
    (m) => new Date(m.releaseDate) <= cutoff && (type === "all" || m.type === type),
  );

  const best = models.reduce((best, model) => {
    const score = model.benchmarks[benchmark];
    if (score == null) return best;
    if (!best || score > best.score) return { model, score };
    return best;
  }, null);

  return best;
}

export function calculateGap(date, benchmark) {
  const frontier = getBestScoreByDate(date, benchmark, "closed");
  const open = getBestScoreByDate(date, benchmark, "open");

  if (!frontier || !open) return null;

  return {
    date,
    benchmark,
    frontierScore: frontier.score,
    frontierModel: frontier.model.name,
    openScore: open.score,
    openModel: open.model.name,
    gap: frontier.score - open.score,
    gapPercent: ((frontier.score - open.score) / frontier.score) * 100,
  };
}

export function getGapHistory(benchmark = "mmlu") {
  const dates = [
    "2023-03-01",
    "2023-06-01",
    "2023-09-01",
    "2023-12-01",
    "2024-03-01",
    "2024-06-01",
    "2024-09-01",
    "2024-12-01",
    "2025-03-01",
    "2025-06-01",
    "2025-09-01",
    "2025-12-01",
    "2026-03-01",
  ];

  return dates.map((date) => calculateGap(date, benchmark)).filter(Boolean);
}

// Find which historical closed models an open model matches or beats
export function findHistoricalMatches(openModel, benchmark = "mmlu") {
  const openScore = openModel.benchmarks[benchmark];
  if (openScore == null) return [];

  const closedModels = HISTORICAL_MODELS.filter(
    (m) => m.type === "closed" && m.benchmarks[benchmark] != null,
  ).sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  const matches = [];
  let previousBestScore = -1;

  for (const closed of closedModels) {
    const closedScore = closed.benchmarks[benchmark];

    // Check if this closed model was ever the best at its time
    const wasBestAtTime = closedScore > previousBestScore;

    if (wasBestAtTime) {
      previousBestScore = closedScore;
    }

    // Open model matches or beats this closed model
    if (openScore >= closedScore) {
      matches.push({
        closedModel: closed,
        closedScore,
        openScore,
        matchedAt: openModel.releaseDate,
        closedReleasedAt: closed.releaseDate,
        timeBehind: monthsBetween(closed.releaseDate, openModel.releaseDate),
      });
    }
  }

  // Find the most impressive match (highest scoring closed model beaten)
  if (matches.length > 0) {
    matches.sort((a, b) => b.closedScore - a.closedScore);
    matches[0].isBestMatch = true;
  }

  return matches;
}

function monthsBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

// Get all open models with their historical matches
export function getOpenModelComparisons(benchmark = "mmlu") {
  const openModels = HISTORICAL_MODELS.filter(
    (m) => m.type === "open" && m.benchmarks[benchmark] != null,
  ).sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  return openModels.map((model) => ({
    model,
    matches: findHistoricalMatches(model, benchmark),
  }));
}

// Find the "time machine" comparison - which closed model from the past does this open model match?
export function getTimeMachineComparison(openModelId, benchmark = "mmlu") {
  const openModel = HISTORICAL_MODELS.find((m) => m.id === openModelId);
  if (!openModel) return null;

  const matches = findHistoricalMatches(openModel, benchmark);
  if (matches.length === 0) return null;

  const bestMatch = matches.find((m) => m.isBestMatch) || matches[0];

  return {
    openModel,
    matchedClosedModel: bestMatch.closedModel,
    openScore: bestMatch.openScore,
    closedScore: bestMatch.closedScore,
    closedReleaseDate: bestMatch.closedModel.releaseDate,
    monthsBehind: bestMatch.timeBehind,
    yearsBehind: (bestMatch.timeBehind / 12).toFixed(1),
    allMatches: matches,
  };
}
