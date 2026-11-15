import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import axios from "axios";
import app from "../app.js";
import { clearWeatherCache } from "../routes/openWeatherRouter.js";

vi.mock("axios");
const mockedGet = vi.mocked(axios.get);

beforeEach(() => {
  mockedGet.mockReset();
  clearWeatherCache();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("GET /api", () => {
  it("responds with app info", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("info");
  });
});

describe("GET /api/open-weather", () => {
  it("returns 400 without coordinates", async () => {
    const res = await request(app).get("/api/open-weather");
    expect(res.status).toBe(400);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it("proxies the OpenWeather response", async () => {
    mockedGet.mockResolvedValueOnce({ data: { name: "Mitte", main: { temp: 10 } } });
    const res = await request(app).get("/api/open-weather?lat=52.52&lon=13.405");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Mitte");
    expect(mockedGet.mock.calls[0][1]?.params).toMatchObject({ lat: "52.52", lon: "13.405", units: "metric" });
  });

  it("serves repeated requests from the cache", async () => {
    mockedGet.mockResolvedValueOnce({ data: { name: "Mitte" } });
    await request(app).get("/api/open-weather?lat=52.52&lon=13.405");
    const res = await request(app).get("/api/open-weather?lat=52.52&lon=13.405");
    expect(res.body.name).toBe("Mitte");
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when OpenWeather fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("boom"));
    const res = await request(app).get("/api/open-weather?lat=52.52&lon=13.405");
    expect(res.status).toBe(500);
  });
});

describe("GET /api/bvg", () => {
  it("returns 400 when address is missing", async () => {
    const res = await request(app).get("/api/bvg?lat=52.52&lon=13.405");
    expect(res.status).toBe(400);
  });

  it("proxies the BVG response", async () => {
    mockedGet.mockResolvedValueOnce({ data: { reachable: [] } });
    const res = await request(app).get("/api/bvg?lat=52.52&lon=13.405&address=Alexanderplatz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ reachable: [] });
  });
});

describe("GET /api/berlin-constructions", () => {
  it("returns 400 without coordinates", async () => {
    const res = await request(app).get("/api/berlin-constructions");
    expect(res.status).toBe(400);
  });

  it("returns only constructions within 1 km", async () => {
    const near = { type: "Feature", properties: { id: "near" }, geometry: { type: "Point", coordinates: [13.4105, 52.5208] } };
    const far = { type: "Feature", properties: { id: "far" }, geometry: { type: "Point", coordinates: [13.0645, 52.3906] } };
    mockedGet.mockResolvedValueOnce({ data: { features: [near, far] } });

    const res = await request(app).get("/api/berlin-constructions?lat=52.5219&lon=13.4132");
    expect(res.status).toBe(200);
    expect(res.body.nearby.map((f: { properties: { id: string } }) => f.properties.id)).toEqual(["near"]);
  });

  it("returns 500 when the upstream API fails", async () => {
    mockedGet.mockRejectedValueOnce(new Error("boom"));
    const res = await request(app).get("/api/berlin-constructions?lat=52.52&lon=13.405");
    expect(res.status).toBe(500);
  });
});
