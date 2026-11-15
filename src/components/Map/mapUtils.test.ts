import { describe, expect, it } from "vitest";
import { hasCoordinates } from "./mapUtils";
import type { BvgStation, LatLon } from "../../types";

describe("hasCoordinates", () => {
  it("accepts items with numeric latitude/longitude", () => {
    const location: LatLon = { latitude: 52.52, longitude: 13.405, display_name: "Berlin" };
    expect(hasCoordinates(location)).toBe(true);
  });

  it("rejects items whose coordinates are nested (e.g. BVG stations)", () => {
    const station = {
      id: "1",
      name: "Alexanderplatz",
      location: { latitude: 52.52, longitude: 13.41 },
    } as BvgStation;
    expect(hasCoordinates(station)).toBe(false);
  });
});
