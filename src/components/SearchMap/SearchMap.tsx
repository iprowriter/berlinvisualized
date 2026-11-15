import { useEffect, useState } from "react";
import "./searchmap.css";
import { Search, X } from "lucide-react";
import useUIState from "../../store/useUIStore";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";
import { geocodeAddress, getBerlinConstructions, getBVGData, getOpenWeather } from "../../apiCalls/ApiCall";
import type { LatLon } from "../../types";
import LayeredMap from "../Map/LayeredMap";
import { formatString } from "../utils/helperFunctions";
import useFetchedDataStore from "../../store/useFetchedDataStore";
import ToggleLayers from "../ViewControls/ToggleLayers";

const SearchMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [boundingBox, setBoundingBox] = useState<number[]>([]);
  const { isLayersTogglerMinimized, addNotification, setIsLoading } = useUIState();
  const { mapLayers, updateLayerData } = useReactLeafletMapStore();
  const { setBvgData, setBerlinConstructionsData } = useFetchedDataStore();

  useEffect(() => {
    // Berlin coordinates
    getOpenWeather(52.52, 13.405);
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!searchQuery) {
      addNotification("No search query provided");
      return;
    }

    setIsLoading(true);
    const data = await geocodeAddress(searchQuery);

    if (!data) {
      addNotification(`Search for ${searchQuery} was not successful`);
      setIsLoading(false);
      return;
    }

    const lat = Number(data.lat);
    const lon = Number(data.lon);
    const location: LatLon[] = [{ latitude: lat, longitude: lon, display_name: data.display_name }];

    setBoundingBox(data.boundingbox.map(Number));
    addNotification(`Search for ${searchQuery} was successful`);
    setIsLoading(false);
    updateLayerData("location_layer", location);

    const bvgData = await getBVGData(lat, lon, formatString(searchQuery), setBvgData);
    const stations = bvgData?.reachable?.flatMap((r) => r.stations) ?? [];
    const constructions = await getBerlinConstructions(lat, lon, setBerlinConstructionsData);

    updateLayerData("transportation_layer", stations);
    updateLayerData("berlin_construction_layer", constructions?.nearby ?? []);
  };

  return (
    <main className="searchMapContainer">
      <div className="searchBar">
        <div className="searchBarDiv">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for an address"
              name="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
          </form>
          <div>
            <Search
              size={28}
              style={{
                marginRight: "7px",
                textAlign: "start",
                cursor: searchQuery ? "pointer" : "not-allowed",
                opacity: searchQuery ? 1 : 0.5,
              }}
              onClick={handleSubmit}
            />
            {searchQuery && <X size={28} onClick={() => setSearchQuery("")} />}
          </div>
        </div>
      </div>
      <div className={isLayersTogglerMinimized ? "toggleLayerMinimzedBar" : "toggleLayerBar"}>
        <ToggleLayers />
      </div>
      <div className="mapContainer">
        <LayeredMap boundingBox={boundingBox} zoomToLocation layers={mapLayers} />
      </div>
    </main>
  );
};

export default SearchMap;
