/**
 * Everything the Overview page shows is configured here (ADR 0004).
 * To light up a "coming soon" item, give it data / a view; the page layout doesn't change.
 * When the layer registry from ADR 0002 exists, THEMES should be derived from it.
 */
import { Bike, Bus, CloudSun, House, Landmark, Leaf, TrainFront, Users, Wind, type LucideIcon } from "lucide-react";
import { berlinRent } from "../utils/berlinRent";
import type { View } from "../../types";

// ---------- District map metrics ----------

export interface DistrictMetric {
  id: string;
  label: string;
  /** Short explanation shown under the map. */
  description: string;
  format: (value: number) => string;
  /** Value per district name (as in /api/districts `name`). `null` = not available yet. */
  values: Record<string, number> | null;
  source?: string;
}

const euroPerSqm = (v: number) => `€${v.toFixed(2)}/m²`;

export const DISTRICT_METRICS: DistrictMetric[] = [
  {
    id: "rent",
    label: "Median rent",
    description: "Median asking rent per m², by district.",
    format: euroPerSqm,
    values: Object.fromEntries(berlinRent.map((d) => [d.district, d.median_rent])),
    source: "Sample data. To be replaced by the official Mietspiegel (ADR 0003).",
  },
  {
    id: "population",
    label: "Population",
    description: "Registered residents per district.",
    format: (v) => v.toLocaleString("en-GB"),
    values: null,
  },
  {
    id: "trees",
    label: "Street trees",
    description: "Street trees per district.",
    format: (v) => v.toLocaleString("en-GB"),
    values: null,
  },
  {
    id: "air",
    label: "Air quality",
    description: "Average NO₂ concentration (µg/m³).",
    format: (v) => `${v.toFixed(0)} µg/m³`,
    values: null,
  },
];

/** Extra rent detail for the district snapshot. */
export const AVERAGE_RENT: Record<string, number> = Object.fromEntries(
  berlinRent.map((d) => [d.district, d.average_rent]),
);
export { euroPerSqm };

// ---------- Live strip ----------

export interface LiveSignal {
  id: "weather" | "air" | "bikes" | "disruptions";
  label: string;
  icon: LucideIcon;
  available: boolean;
}

export const LIVE_SIGNALS: LiveSignal[] = [
  { id: "weather", label: "Weather", icon: CloudSun, available: true },
  { id: "air", label: "Air quality", icon: Wind, available: false },
  { id: "bikes", label: "Bikes available", icon: Bike, available: false },
  { id: "disruptions", label: "BVG disruptions", icon: TrainFront, available: false },
];

// ---------- Themes ----------

export interface Theme {
  id: "mobility" | "environment" | "living" | "society" | "history";
  label: string;
  icon: LucideIcon;
  description: string;
  /** Datasets live today. */
  layers: string[];
  /** Where "Explore" goes. Omit when there's no view yet. */
  view?: View;
}

export const THEMES: Theme[] = [
  {
    id: "mobility",
    label: "Mobility",
    icon: Bus,
    description: "Transit stations, road works, bikes and traffic.",
    layers: ["BVG stations", "Road works"],
    view: "map",
  },
  {
    id: "environment",
    label: "Environment",
    icon: Leaf,
    description: "Weather, air quality, trees and noise.",
    layers: ["Current weather"],
  },
  {
    id: "living",
    label: "Living",
    icon: House,
    description: "Rents, schools, parks and everyday amenities.",
    layers: ["Rent by district"],
    view: "rents",
  },
  {
    id: "society",
    label: "Society",
    icon: Users,
    description: "Population, elections and safety.",
    layers: [],
  },
  {
    id: "history",
    label: "History",
    icon: Landmark,
    description: "The Berlin Wall, Stolpersteine and monuments.",
    layers: [],
  },
];
