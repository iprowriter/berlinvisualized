import React, { useState } from "react";
import "./toggle-layer.css";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";

const ToggleLayers: React.FC = () => {
  const [locationVisible, setLocationVisible] = useState(false);
  const [transportVisible, setTransportVisible] = useState(true);
  const [constructionVisible, setTonstructionVisibleVisible] = useState(true);


  const {toggleLayerVisibility} = useReactLeafletMapStore();

  const handleLocation = () => {
    setLocationVisible(!locationVisible);
    toggleLayerVisibility('location_layer');
  }

  const handleTransportation = () => {
    setTransportVisible(!transportVisible)
    toggleLayerVisibility('transportation_layer');
  } 

  const handleConstruction = () => {
    setTonstructionVisibleVisible(!constructionVisible )
    toggleLayerVisibility('berlin_construction_layer');
  } 



  return (
    <div className="toggleLayersContainer">
      <h3>Toggle Layers</h3>

      {/* Location Toggle */}
      <div className={`toggleButton ${locationVisible ? "toggleChecked" : ""}`} onClick={() => handleLocation()}>
        <span>📍 Location</span>
        <div className="switch"></div>
      </div>

      {/* Transport Toggle */}
      <div className={`toggleButton ${transportVisible ? "toggleChecked" : ""}`} onClick={() => handleTransportation()}>
        <span>🚉 Transport</span>
        <div className="switch"></div>
      </div>

      {/* Transport Toggle */}
      <div className={`toggleButton ${constructionVisible ? "toggleChecked" : ""}`} onClick={() => handleConstruction()}>
        <span>🚧 Constructions </span>
        <div className="switch"></div>
      </div>
    </div>
  );
};

export default ToggleLayers;
