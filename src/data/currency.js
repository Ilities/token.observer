// Fixed, manually maintained USD → EUR exchange rate.
// Update this single value when the rate changes.
// Set: 2026-10-14
export const EUR_PER_USD = 0.92;

// USD, preserving the raw value (per-million token prices lose precision when
// grouped). Pass `group` for larger flat costs that were previously shown with
// thousands separators.
export function usd(amount, decimals, group = false) {
  if (amount == null) return "—";
  let value;
  if (decimals != null) value = amount.toFixed(decimals);
  else if (group) value = amount.toLocaleString("en-US");
  else value = String(amount);
  return `$${value}`;
}

// EUR, always rounded to cents.
export function eur(amount) {
  if (amount == null) return "—";
  const value = (amount * EUR_PER_USD).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `€${value}`;
}

// The pair used to render both currencies; null when there is no price.
export function dual(amount, decimals, group = false) {
  if (amount == null) return null;
  return { usd: usd(amount, decimals, group), eur: eur(amount) };
}
