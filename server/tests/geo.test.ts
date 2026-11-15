import { describe, expect, it } from "vitest";
import { extractCoordinates, filterNearby, isWithinDistance, type ConstructionFeature, type LonLat } from "../utils/geo.js";

const ALEXANDERPLATZ: LonLat = [13.4132, 52.5219];
const NEARBY: LonLat = [13.4105, 52.5208]; // ~200 m away
const POTSDAM: LonLat = [13.0645, 52.3906]; // ~27 km away

const feature = (geometry: ConstructionFeature["geometry"]): ConstructionFeature => ({
  type: "Feature",
  geometry,
  properties: {},
});

describe("extractCoordinates", () => {
  it("returns the point for a Point geometry", () => {
    expect(extractCoordinates({ type: "Point", coordinates: NEARBY })).toEqual([NEARBY]);
  });

  it("flattens points and line strings in a GeometryCollection", () => {
    expect(
      extractCoordinates({
        type: "GeometryCollection",
        geometries: [
          { type: "Point", coordinates: ALEXANDERPLATZ },
          { type: "LineString", coordinates: [NEARBY, POTSDAM] },
        ],
      }),
    ).toEqual([ALEXANDERPLATZ, NEARBY, POTSDAM]);
  });

  it("returns an empty list for missing geometry", () => {
    expect(extractCoordinates(null)).toEqual([]);
    expect(extractCoordinates(undefined)).toEqual([]);
  });
});

describe("isWithinDistance", () => {
  it("is true for points closer than the limit", () => {
    expect(isWithinDistance(ALEXANDERPLATZ, NEARBY)).toBe(true);
  });

  it("is false for points farther than the limit", () => {
    expect(isWithinDistance(ALEXANDERPLATZ, POTSDAM)).toBe(false);
  });

  it("respects a custom limit", () => {
    expect(isWithinDistance(ALEXANDERPLATZ, NEARBY, 50)).toBe(false);
  });
});

describe("filterNearby", () => {
  it("keeps features with any position near the center", () => {
    const near = feature({ type: "Point", coordinates: NEARBY });
    const far = feature({ type: "Point", coordinates: POTSDAM });
    const lineThroughCenter = feature({
      type: "GeometryCollection",
      geometries: [{ type: "LineString", coordinates: [POTSDAM, NEARBY] }],
    });
    const noGeometry = feature(null);

    expect(filterNearby([near, far, lineThroughCenter, noGeometry], ALEXANDERPLATZ)).toEqual([near, lineThroughCenter]);
  });
});
