// Models data imported from JSON
// Last updated: March 2026

import data from "./models.json";

export const TIERS = data.TIERS;
export const GPU_CONFIGS = data.GPU_CONFIGS;
export const MODELS = data.MODELS;
export const SORTED_MODELS = [...data.MODELS].sort((a, b) => a.name.localeCompare(b.name));
export const USAGE_PROFILES = data.USAGE_PROFILES;
export const THESIS_POINTS = data.THESIS_POINTS;

// ─────────────────────────────────────────────
// COST CALCULATION HELPERS
// ─────────────────────────────────────────────

export function monthlyApiCost(tokensPerDay, pricing, inputRatio = 0.7) {
  const inputTokensPerDay = tokensPerDay * inputRatio;
  const outputTokensPerDay = tokensPerDay * (1 - inputRatio);
  const dailyCost =
    (inputTokensPerDay / 1_000_000) * pricing.input +
    (outputTokensPerDay / 1_000_000) * pricing.output;
  return dailyCost * 30;
}

export function monthlyRentalCost(hoursActivePerDay, costPerHr) {
  return hoursActivePerDay * costPerHr * 30;
}

export function paybackMonths(hardwareCost, monthlyElectricity, monthlyApiCostSaved) {
  const monthlySavings = monthlyApiCostSaved - monthlyElectricity;
  if (monthlySavings <= 0) return Infinity;
  return hardwareCost / monthlySavings;
}

export function compareOptions(modelId, usageProfileId, hardwareIndex = 0) {
  const model = MODELS.find((m) => m.id === modelId);
  const usage = USAGE_PROFILES.find((u) => u.id === usageProfileId);
  const tier = TIERS[model.tier];
  if (!model || !usage) return null;

  const cheapestProvider = model.apiProviders.find((p) => p.input && p.output);
  const cheapestRental = model.rentalOptions[0];
  const hardware = model.purchaseOptions[hardwareIndex];

  const closedApiMonthly = monthlyApiCost(usage.tokensPerDay, tier.closedApiCost);
  const openApiMonthly = monthlyApiCost(usage.tokensPerDay, cheapestProvider);
  const rentalMonthly = monthlyRentalCost(usage.hoursActivePerDay, cheapestRental.costPerHr);
  const ownedMonthly = hardware.monthlyElectricity;

  const paybackVsClosed = paybackMonths(
    hardware.usedCost || hardware.purchaseCost,
    ownedMonthly,
    closedApiMonthly,
  );
  const paybackVsOpen = paybackMonths(
    hardware.usedCost || hardware.purchaseCost,
    ownedMonthly,
    openApiMonthly,
  );

  return {
    model,
    usage,
    tier,
    costs: {
      closedApi: {
        label: tier.closedApiName,
        monthly: closedApiMonthly,
        daily: closedApiMonthly / 30,
      },
      openApi: {
        label: `${model.name} via ${cheapestProvider.name}`,
        monthly: openApiMonthly,
        daily: openApiMonthly / 30,
        provider: cheapestProvider.name,
      },
      rental: {
        label: `${model.name} — ${cheapestRental.name}`,
        monthly: rentalMonthly,
        daily: rentalMonthly / 30,
        note: `${usage.hoursActivePerDay}hr active/day @ $${cheapestRental.costPerHr}/hr`,
        caveat:
          "Rental only makes sense if your usage is predictable and sustained. Idle time is waste.",
      },
      owned: {
        label: hardware.name,
        upfront: hardware.purchaseCost,
        usedUpfront: hardware.usedCost,
        monthly: ownedMonthly,
        daily: ownedMonthly / 30,
        canRun: hardware.canRunModel,
        quality: hardware.quality,
        paybackVsClosed: paybackVsClosed === Infinity ? null : paybackVsClosed,
        paybackVsOpen: paybackVsOpen === Infinity ? null : paybackVsOpen,
      },
    },
    savings: {
      openVsClosed: closedApiMonthly - openApiMonthly,
      rentalVsClosed: closedApiMonthly - rentalMonthly,
      ownedVsClosed: closedApiMonthly - ownedMonthly,
    },
    verdict: getVerdict({
      openApiMonthly,
      rentalMonthly,
      ownedMonthly,
      hardware,
      paybackVsClosed,
      paybackVsOpen,
    }),
  };
}

function getVerdict({
  openApiMonthly,
  rentalMonthly,
  ownedMonthly,
  hardware,
  paybackVsClosed,
  paybackVsOpen,
}) {
  if (openApiMonthly < 10)
    return {
      recommendation: "api",
      reason:
        "Your usage is low — even the cheapest open API costs under $10/month. Not worth the ops overhead of any infrastructure.",
    };
  if (openApiMonthly < 30)
    return {
      recommendation: "api",
      reason: "Open API is the right call. Under $30/month is too low to justify hardware.",
    };
  if (paybackVsOpen !== null && paybackVsOpen < 18)
    return {
      recommendation: "buy_hardware",
      reason: `Hardware (${hardware.name}) pays back in ${paybackVsOpen.toFixed(0)} months vs the open API. Buy used.`,
    };
  if (paybackVsClosed !== null && paybackVsClosed < 24)
    return {
      recommendation: "buy_hardware",
      reason: `If you're currently paying ${hardware.name.closedApiName || "closed API"} rates, hardware pays back in ${paybackVsClosed.toFixed(0)} months.`,
    };
  return {
    recommendation: "api",
    reason: "Open API is still cheapest at your usage level — no infrastructure overhead.",
  };
}

export function buildCostTable(modelId) {
  const model = MODELS.find((m) => m.id === modelId);
  const tier = TIERS[model.tier];
  const cheapestOpen = model.apiProviders.find((p) => p.input && p.output);
  const cheapestRental = model.rentalOptions[0];
  const bestHardware = model.purchaseOptions[0];

  return USAGE_PROFILES.map((usage) => {
    const closedMonthly = monthlyApiCost(usage.tokensPerDay, tier.closedApiCost);
    const openMonthly = monthlyApiCost(usage.tokensPerDay, cheapestOpen);
    const rentalMonthly = monthlyRentalCost(usage.hoursActivePerDay, cheapestRental.costPerHr);
    const ownedMonthly = bestHardware.monthlyElectricity;
    const payback = paybackMonths(
      bestHardware.usedCost || bestHardware.purchaseCost,
      ownedMonthly,
      closedMonthly,
    );

    const costs = { closedMonthly, openMonthly, rentalMonthly, ownedMonthly };
    const winner = Object.entries(costs).reduce((a, b) => (a[1] < b[1] ? a : b))[0];

    return {
      usageLabel: usage.label,
      tokensPerDay: usage.tokensPerDay,
      closedApiMonthly: closedMonthly,
      openApiMonthly: openMonthly,
      rentalMonthly: rentalMonthly,
      ownedMonthly: ownedMonthly,
      savingsOpenVsClosed: closedMonthly - openMonthly,
      paybackMonthsUsed: payback === Infinity ? null : payback,
      winner,
      cheapestHardware: bestHardware.name,
      cheapestHardwareCost: bestHardware.usedCost || bestHardware.purchaseCost,
    };
  });
}
