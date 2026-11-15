import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DistrictCollection } from "../../types";
import { colorFor, type ChoroplethBin } from "./choropleth";
import type { DistrictMetric } from "./overviewConfig";

interface DistrictMapProps {
  districts: DistrictCollection;
  metric: DistrictMetric;
  bins: ChoroplethBin[];
  selected: string | null;
  onSelect: (name: string) => void;
}

const SELECTED_OUTLINE = "#14172e";
const DISTRICT_GAP = "#ffffff";

/** Choropleth of Berlin's 12 districts for one metric. Hover for a tooltip, click to select. */
const DistrictMap: React.FC<DistrictMapProps> = ({ districts, metric, bins, selected, onSelect }) => {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  // Leaflet handlers are bound once per layer; refs keep them reading current props.
  const metricRef = useRef(metric);
  const onSelectRef = useRef(onSelect);
  metricRef.current = metric;
  onSelectRef.current = onSelect;

  const style = useMemo(
    () =>
      (feature?: GeoJSON.Feature): L.PathOptions => {
        const name = (feature?.properties as { name?: string } | undefined)?.name ?? "";
        const isSelected = name === selected;
        return {
          fillColor: colorFor(metric.values?.[name], bins),
          fillOpacity: 0.85,
          color: isSelected ? SELECTED_OUTLINE : DISTRICT_GAP,
          weight: isSelected ? 3 : 2,
        };
      },
    [metric, bins, selected],
  );

  // Keep the selected outline on top of its neighbours.
  useEffect(() => {
    geoJsonRef.current?.eachLayer((layer) => {
      const name = ((layer as L.Polygon).feature?.properties as { name?: string } | undefined)?.name;
      if (name === selected) (layer as L.Polygon).bringToFront();
    });
  }, [selected]);

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const name = (feature.properties as { name: string }).name;
    const path = layer as L.Path;

    path.bindTooltip(
      () => {
        const value = metricRef.current.values?.[name];
        const text = value === undefined ? "No data" : metricRef.current.format(value);
        return `<strong>${name}</strong><br/>${metricRef.current.label}: ${text}`;
      },
      { sticky: true, direction: "top", offset: [0, -8] },
    );
    path.on({
      click: () => onSelectRef.current(name),
      mouseover: () => path.setStyle({ fillOpacity: 1 }),
      mouseout: () => path.setStyle({ fillOpacity: 0.85 }),
    });
  };

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={10}
      scrollWheelZoom={false}
      zoomSnap={0.25}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Districts: <a href="https://gdi.berlin.de">Geoportal Berlin</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="ovBasemap"
      />
      <GeoJSON
        key={metric.id}
        ref={geoJsonRef}
        data={districts}
        style={style}
        onEachFeature={onEachFeature}
      />
      <FitToDistricts districts={districts} />
    </MapContainer>
  );
};

export default DistrictMap;

const FitToDistricts: React.FC<{ districts: DistrictCollection }> = ({ districts }) => {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(districts).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [8, 8] });
  }, [map, districts]);
  return null;
};
