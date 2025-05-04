import React from "react";
import "./toggle-layer.css";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";

const ToggleLayers: React.FC = () => {
  
  
    const mapLayers = useReactLeafletMapStore((state) => state.mapLayers);
    const toggleLayerVisibility = useReactLeafletMapStore((state) => state.toggleLayerVisibility);
  
    const getLayerById = (id: string) => mapLayers.find((layer) => layer.id === id);



  return (
    <div className="toggleLayersContainer">
      <h3>Toggle Layers</h3>

      {/* Location Toggle */}
      <div className={`toggleButton ${getLayerById("location_layer")?.visible ? "toggleChecked" : ""}`} onClick={() => toggleLayerVisibility("location_layer")}>
        <span>📍 Location</span>
        <div className="switch"></div>
      </div>

      {/* Transport Toggle */}
      <div className={`toggleButton ${getLayerById("transportation_layer")?.visible ? "toggleChecked" : ""}`} onClick={() => toggleLayerVisibility("transportation_layer")}>
        <span>🚉 Transport</span>
        <div className="switch"></div>
      </div>

      {/* Transport Toggle */}
      <div className={`toggleButton ${getLayerById("berlin_construction_layer")?.visible ? "toggleChecked" : ""}`} onClick={() => toggleLayerVisibility("berlin_construction_layer")}>
        <span>🚧 Constructions </span>
        <div className="switch"></div>
      </div>
    </div>
  );
};

export default ToggleLayers;
