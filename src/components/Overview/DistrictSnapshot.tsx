import { rankDistricts, colorFor, type ChoroplethBin } from "./choropleth";
import { AVERAGE_RENT, DISTRICT_METRICS, euroPerSqm, type DistrictMetric } from "./overviewConfig";

interface DistrictSnapshotProps {
  districtNames: string[];
  metric: DistrictMetric;
  bins: ChoroplethBin[];
  selected: string | null;
  onSelect: (name: string) => void;
}

/**
 * The selected district's numbers, plus every district ranked for the active metric.
 * The ranking table is also the non-color, keyboard-accessible view of the map.
 */
const DistrictSnapshot: React.FC<DistrictSnapshotProps> = ({ districtNames, metric, bins, selected, onSelect }) => {
  const ranked = rankDistricts(districtNames, metric.values ?? {});
  const rankedCount = ranked.filter((r) => r.rank !== undefined).length;
  const current = ranked.find((r) => r.name === selected);

  return (
    <aside className="ovSnapshot" aria-label="District snapshot">
      {current ? (
        <div className="ovSnapshotCard">
          <p className="ovEyebrow">Selected district</p>
          <h3 className="ovSnapshotTitle">{current.name}</h3>
          <dl className="ovStats">
            {DISTRICT_METRICS.map((m) => {
              const value = m.values?.[current.name];
              return (
                <div key={m.id} className="ovStat">
                  <dt>{m.label}</dt>
                  <dd className={value === undefined ? "ovMuted" : undefined}>
                    {m.values === null ? "Coming soon" : value === undefined ? "No data" : m.format(value)}
                  </dd>
                </div>
              );
            })}
            {AVERAGE_RENT[current.name] !== undefined && (
              <div className="ovStat">
                <dt>Average rent</dt>
                <dd>{euroPerSqm(AVERAGE_RENT[current.name])}</dd>
              </div>
            )}
          </dl>
          {current.rank !== undefined && (
            <p className="ovRankNote">
              #{current.rank} of {rankedCount} for {metric.label.toLowerCase()}
            </p>
          )}
        </div>
      ) : (
        <div className="ovSnapshotCard ovSnapshotEmpty">
          <p className="ovEyebrow">District snapshot</p>
          <p>Click a district on the map or in the list to see its numbers.</p>
        </div>
      )}

      <table className="ovRanking">
        <caption>{metric.label} by district</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">District</th>
            <th scope="col" className="ovNum">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r) => (
            <tr key={r.name} className={r.name === selected ? "ovRowSelected" : undefined}>
              <td className="ovNum ovMuted">{r.rank ?? "–"}</td>
              <td>
                <button type="button" className="ovRowButton" onClick={() => onSelect(r.name)}>
                  <span className="ovSwatch" style={{ background: colorFor(r.value, bins) }} aria-hidden="true" />
                  {r.name}
                </button>
              </td>
              <td className={`ovNum ${r.value === undefined ? "ovMuted" : ""}`}>
                {r.value === undefined ? "No data" : metric.format(r.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
};

export default DistrictSnapshot;
