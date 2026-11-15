/**
 * Helpers for the district choropleth (ADR 0004).
 *
 * Colors: one-hue sequential blue, steps 250→650 of the reference ramp, validated as an
 * ordinal ramp (monotone lightness, visible gaps, light end ≥ 2:1 on the light surface).
 */
export const CHOROPLETH_COLORS = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"] as const;
export const NO_DATA_COLOR = "#d6d5d0";

export interface ChoroplethBin {
  min: number;
  max: number;
  color: string;
}

/** Splits [min, max] of the values into equal-width bins, one per color. */
export function equalIntervalBins(values: number[], colors: readonly string[] = CHOROPLETH_COLORS): ChoroplethBin[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / colors.length;
  return colors.map((color, i) => ({
    min: min + step * i,
    max: i === colors.length - 1 ? max : min + step * (i + 1),
    color,
  }));
}

/** Color for a value, or the no-data color when the value is missing. */
export function colorFor(value: number | undefined, bins: ChoroplethBin[]): string {
  if (value === undefined || bins.length === 0) return NO_DATA_COLOR;
  const bin = bins.find((b) => value <= b.max) ?? bins[bins.length - 1];
  return bin.color;
}

/** Districts sorted by value (highest first), with districts lacking data last, alphabetically. */
export function rankDistricts(
  names: string[],
  values: Record<string, number>,
): { name: string; value: number | undefined; rank: number | undefined }[] {
  const withData = names
    .filter((n) => values[n] !== undefined)
    .sort((a, b) => values[b] - values[a])
    .map((name, i) => ({ name, value: values[name], rank: i + 1 }));
  const withoutData = names
    .filter((n) => values[n] === undefined)
    .sort((a, b) => a.localeCompare(b, "de"))
    .map((name) => ({ name, value: undefined, rank: undefined }));
  return [...withData, ...withoutData];
}
