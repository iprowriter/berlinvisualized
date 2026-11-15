import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import axios from "axios";
import app from "../app.js";
import { clearDistrictsCache, roundCoordinates, toDistrictCollection } from "../routes/districtsRouter.js";

vi.mock("axios");
const mockedGet = vi.mocked(axios.get);

const wfsFeature = {
  type: "Feature" as const,
  geometry: {
    type: "Polygon" as const,
    coordinates: [[[13.123456789, 52.987654321], [13.2, 52.9], [13.3, 52.95], [13.123456789, 52.987654321]]],
  },
  properties: { gem: "001", namgem: "Mitte", namlan: "Berlin" },
};

beforeEach(() => {
  mockedGet.mockReset();
  clearDistrictsCache();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("roundCoordinates", () => {
  it("rounds nested positions to 5 decimals", () => {
    expect(roundCoordinates([[[13.123456789, 52.987654321]]])).toEqual([[[13.12346, 52.98765]]]);
  });
});

describe("toDistrictCollection", () => {
  it("keeps only id and name properties", () => {
    const { features } = toDistrictCollection([wfsFeature]);
    expect(features[0].properties).toEqual({ id: "001", name: "Mitte" });
    expect(features[0].geometry.type).toBe("Polygon");
  });
});

describe("GET /api/districts", () => {
  it("returns slimmed district boundaries", async () => {
    mockedGet.mockResolvedValueOnce({ data: { features: [wfsFeature] } });
    const res = await request(app).get("/api/districts");
    expect(res.status).toBe(200);
    expect(res.body.type).toBe("FeatureCollection");
    expect(res.body.features[0].properties.name).toBe("Mitte");
    expect(mockedGet.mock.calls[0][1]?.params).toMatchObject({ srsName: "EPSG:4326", outputFormat: "application/json" });
  });

  it("caches the boundaries", async () => {
    mockedGet.mockResolvedValueOnce({ data: { features: [wfsFeature] } });
    await request(app).get("/api/districts");
    await request(app).get("/api/districts");
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when Geoportal is unreachable and nothing is cached", async () => {
    mockedGet.mockRejectedValueOnce(new Error("timeout"));
    const res = await request(app).get("/api/districts");
    expect(res.status).toBe(502);
  });
});
