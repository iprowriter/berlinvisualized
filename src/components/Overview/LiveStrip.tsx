import { useEffect, useState } from "react";
import { getOpenWeather } from "../../apiCalls/ApiCall";
import type { OpenWeatherResponse } from "../../types";
import { LIVE_SIGNALS, type LiveSignal } from "./overviewConfig";

/** One chip per live signal. Signals without data yet render as muted "coming soon" chips. */
const LiveStrip: React.FC = () => {
  const [weather, setWeather] = useState<OpenWeatherResponse | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getOpenWeather(52.52, 13.405).then((data) => {
      if (!cancelled) setWeather(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const valueFor = (signal: LiveSignal): string => {
    if (!signal.available) return "Coming soon";
    if (signal.id === "weather") {
      if (weather === undefined) return "Loading…";
      if (weather === null) return "Unavailable";
      const description = weather.weather?.[0]?.description;
      return `${Math.round(weather.main.temp)}°C${description ? ` · ${description}` : ""}`;
    }
    return "–";
  };

  return (
    <section className="ovLiveStrip" aria-label="Berlin right now">
      <span className="ovLiveLabel">
        <span className="ovLiveDot" aria-hidden="true" />
        Berlin now
      </span>
      {LIVE_SIGNALS.map((signal) => {
        const Icon = signal.icon;
        return (
          <div key={signal.id} className={`ovChip ${signal.available ? "" : "ovChipSoon"}`}>
            <Icon size={18} aria-hidden="true" />
            <span className="ovChipLabel">{signal.label}</span>
            <span className="ovChipValue">{valueFor(signal)}</span>
          </div>
        );
      })}
    </section>
  );
};

export default LiveStrip;
