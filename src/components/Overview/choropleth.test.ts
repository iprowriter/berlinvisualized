import { describe, expect, it } from "vitest";
import { CHOROPLETH_COLORS, NO_DATA_COLOR, colorFor, equalIntervalBins, rankDistricts } from "./choropleth";

describe("equalIntervalBins", () => {
  it("creates one equal-width bin per color spanning min to max", () => {
    const bins = equalIntervalBins([10, 20, 15]);
    expect(bins).toHaveLength(CHOROPLETH_COLORS.length);
    expect(bins[0].min).toBe(10);
    expect(bins[bins.length - 1].max).toBe(20);
    expect(bins[0].max).toBeCloseTo(12);
  });

  it("returns no bins for no values", () => {
    expect(equalIntervalBins([])).toEqual([]);
  });
});

describe("colorFor", () => {
  const bins = equalIntervalBins([10, 20]);

  it("maps the minimum to the lightest and the maximum to the darkest color", () => {
    expect(colorFor(10, bins)).toBe(CHOROPLETH_COLORS[0]);
    expect(colorFor(20, bins)).toBe(CHOROPLETH_COLORS[4]);
    expect(colorFor(15, bins)).toBe(CHOROPLETH_COLORS[2]);
  });

  it("uses the no-data color for missing values", () => {
    expect(colorFor(undefined, bins)).toBe(NO_DATA_COLOR);
  });

  it("handles all-equal values without dividing by zero", () => {
    const flat = equalIntervalBins([5, 5]);
    expect(colorFor(5, flat)).toBe(CHOROPLETH_COLORS[0]);
  });
});

describe("rankDistricts", () => {
  it("ranks by value and puts districts without data last", () => {
    const ranked = rankDistricts(["Pankow", "Mitte", "Spandau", "Neukölln"], { Mitte: 15, Spandau: 9, Neukölln: 11 });
    expect(ranked.map((r) => r.name)).toEqual(["Mitte", "Neukölln", "Spandau", "Pankow"]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, undefined]);
  });
});
