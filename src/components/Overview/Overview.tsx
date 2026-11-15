import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import "./overview.css";
import useUIState from "../../store/useUIStore";
import { getDistricts } from "../../apiCalls/ApiCall";
import type { DistrictCollection } from "../../types";
import { NO_DATA_COLOR, equalIntervalBins } from "./choropleth";
import { DISTRICT_METRICS, THEMES } from "./overviewConfig";
import DistrictMap from "./DistrictMap";
import DistrictSnapshot from "./DistrictSnapshot";
import LiveStrip from "./LiveStrip";

/** The landing page (ADR 0004). */
const Overview: React.FC = () => {
  const { setSelectedView, setPendingSearch } = useUIState();
  const [query, setQuery] = useState("");
  const [districts, setDistricts] = useState<DistrictCollection | null | undefined>(undefined);
  const [metricId, setMetricId] = useState(DISTRICT_METRICS[0].id);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDistricts().then((data) => {
      if (!cancelled) setDistricts(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const metric = DISTRICT_METRICS.find((m) => m.id === metricId) ?? DISTRICT_METRICS[0];
  const bins = useMemo(() => equalIntervalBins(Object.values(metric.values ?? {})), [metric]);
  const districtNames = useMemo(() => districts?.features.map((f) => f.properties.name) ?? [], [districts]);
  const hasMissing = districtNames.some((n) => metric.values?.[n] === undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setPendingSearch(q);
    setSelectedView("map");
  };

  return (
    <div className="overview">
      {/* Hero */}
      <header className="ovHero">
        <p className="ovEyebrow ovEyebrowLight">Berlin Visualized</p>
        <h1 className="ovTitle">Berlin, in data.</h1>
        <p className="ovLead">
          Transit, road works, rents and more, mapped. Search an address to see what's around it.
        </p>
        <form className="ovSearch" onSubmit={handleSearch} role="search">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search an address, e.g. Alexanderplatz"
            aria-label="Search an address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={!query.trim()}>
            Explore
          </button>
        </form>
      </header>

      <LiveStrip />

      {/* District map */}
      <section className="ovSection" aria-labelledby="ov-districts">
        <div className="ovSectionHead">
          <div>
            <h2 id="ov-districts">Compare the 12 districts</h2>
            <p className="ovMuted">{metric.description}</p>
          </div>
          <div className="ovMetricSwitch" role="group" aria-label="Map metric">
            {DISTRICT_METRICS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={m.id === metric.id ? "active" : undefined}
                aria-pressed={m.id === metric.id}
                disabled={m.values === null}
                title={m.values === null ? "Coming soon" : undefined}
                onClick={() => setMetricId(m.id)}
              >
                {m.label}
                {m.values === null && <span className="ovSoonTag">soon</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="ovDistrictGrid">
          <div className="ovMapCard">
            <div className="ovMap">
              {districts === undefined && <p className="ovMapMessage">Loading districts…</p>}
              {districts === null && (
                <p className="ovMapMessage">
                  Couldn't load district boundaries. Is the backend running?
                </p>
              )}
              {districts && (
                <DistrictMap
                  districts={districts}
                  metric={metric}
                  bins={bins}
                  selected={selected}
                  onSelect={setSelected}
                />
              )}
            </div>
            <div className="ovLegend" aria-label={`${metric.label} legend`}>
              {bins.map((b) => (
                <span key={b.color} className="ovLegendItem">
                  <span className="ovSwatch" style={{ background: b.color }} aria-hidden="true" />
                  {metric.format(b.min)}–{metric.format(b.max)}
                </span>
              ))}
              {hasMissing && (
                <span className="ovLegendItem">
                  <span className="ovSwatch" style={{ background: NO_DATA_COLOR }} aria-hidden="true" />
                  No data
                </span>
              )}
            </div>
            {metric.source && <p className="ovSource">Source: {metric.source}</p>}
          </div>

          {districts && (
            <DistrictSnapshot
              districtNames={districtNames}
              metric={metric}
              bins={bins}
              selected={selected}
              onSelect={setSelected}
            />
          )}
        </div>
      </section>

      {/* Themes */}
      <section className="ovSection" aria-labelledby="ov-themes">
        <div className="ovSectionHead">
          <h2 id="ov-themes">Explore by theme</h2>
        </div>
        <div className="ovThemes">
          {THEMES.map((theme) => {
            const Icon = theme.icon;
            const live = theme.layers.length > 0;
            return (
              <article key={theme.id} className={`ovTheme ${live ? "" : "ovThemeSoon"}`}>
                <div className="ovThemeIcon">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3>{theme.label}</h3>
                <p className="ovMuted">{theme.description}</p>
                <p className="ovThemeCount">
                  {live
                    ? `${theme.layers.length} dataset${theme.layers.length > 1 ? "s" : ""}: ${theme.layers.join(", ")}`
                    : "Coming soon"}
                </p>
                {theme.view && (
                  <button type="button" className="ovLinkButton" onClick={() => setSelectedView(theme.view!)}>
                    Explore <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Data story */}
      <DataStory onOpen={() => setSelectedView("rents")} />
    </div>
  );
};

export default Overview;

/** The curated story of the week. First story: rent across districts, built from the rent metric. */
const DataStory: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const rent = DISTRICT_METRICS.find((m) => m.id === "rent");
  const entries = Object.entries(rent?.values ?? {}).sort((a, b) => b[1] - a[1]);
  if (!rent || entries.length < 2) return null;

  const [highName, high] = entries[0];
  const [lowName, low] = entries[entries.length - 1];
  const gap = Math.round(((high - low) / low) * 100);

  return (
    <section className="ovSection" aria-labelledby="ov-story">
      <article className="ovStory">
        <p className="ovEyebrow ovEyebrowLight">Data story</p>
        <h2 id="ov-story">Where does a square metre cost the most?</h2>
        <p>
          In {highName}, the median rent is {rent.format(high)}. In {lowName}, it's {rent.format(low)}: a
          gap of {gap}% within the same city.
        </p>
        <button type="button" className="ovStoryButton" onClick={onOpen}>
          Open the rent map <ArrowRight size={16} aria-hidden="true" />
        </button>
      </article>
    </section>
  );
};
