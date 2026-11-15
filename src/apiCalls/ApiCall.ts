import { API_URL } from "../config/api";
import type {
  BerlinConstructionsResponse,
  BvgReachableResponse,
  DistrictCollection,
  NominatimLocation,
  OpenWeatherResponse,
} from "../types";

async function getJson<T>(path: string, errorMessage: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${API_URL}${path}`);
    if (!response.ok) throw new Error(errorMessage);
    return (await response.json()) as T;
  } catch (err) {
    console.error(errorMessage, err);
    return undefined;
  }
}

export function getOpenWeather(lat: number, lon: number) {
  return getJson<OpenWeatherResponse>(`/api/open-weather?lat=${lat}&lon=${lon}`, "Failed to fetch weather");
}

export function geocodeAddress(address: string) {
  return getJson<NominatimLocation>(
    `/api/nominatim?address=${encodeURIComponent(address)}`,
    "Failed to geocode address",
  );
}

// `address` is expected pre-formatted with formatString() ("+" for spaces), so it is not re-encoded here.
export async function getBVGData(
  lat: number,
  lon: number,
  address: string,
  setBvgData: (data: BvgReachableResponse) => void,
) {
  const data = await getJson<BvgReachableResponse>(
    `/api/bvg?lat=${lat}&lon=${lon}&address=${address}`,
    "Failed to fetch BVG transportation data",
  );
  if (data) setBvgData(data);
  return data;
}

export async function getBerlinConstructions(
  lat: number,
  lon: number,
  setBerlinConstructionsData: (data: BerlinConstructionsResponse) => void,
) {
  const data = await getJson<BerlinConstructionsResponse>(
    `/api/berlin-constructions?lat=${lat}&lon=${lon}`,
    "Failed to fetch Berlin construction data",
  );
  if (data) setBerlinConstructionsData(data);
  return data;
}

export function getDistricts() {
  return getJson<DistrictCollection>("/api/districts", "Failed to fetch district boundaries");
}
