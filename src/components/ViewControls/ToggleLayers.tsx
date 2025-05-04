import React, { useState } from "react";
import "./toggle-layer.css";
import useReactLeafletMapStore from "../../store/useReactLeafletMapStore";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import useUIState from "../../store/useUIStore";

const ToggleLayers: React.FC = () => {

    const [minimizeToggler, setMinimizeToggler] = useState<boolean>(true)
    const {isLayersTogglerMinimized, setIsLayersTogglerMinimized } = useUIState();
  
  
    const mapLayers = useReactLeafletMapStore((state) => state.mapLayers);
    const toggleLayerVisibility = useReactLeafletMapStore((state) => state.toggleLayerVisibility);
  
    const getLayerById = (id: string) => mapLayers.find((layer) => layer.id === id);



  return (
    <React.Fragment>
        {isLayersTogglerMinimized?        
         <div className="toggleMinimizedContainer">
            <div className="toggleMinimizedIcons" onClick={() => setIsLayersTogglerMinimized(false)}>
            <ArrowBigLeft size={38} />
            </div>
          </div>    : 
    
            <div className="toggleLayersContainer">
                <div className="toggleLayerArrowContainer" onClick={() => setIsLayersTogglerMinimized(true)}> 
                    <ArrowBigRight size={38} /> 
                </div>
                    <p>Turn layers on/off</p>

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
    }         
    </React.Fragment>
  );
};

export default ToggleLayers;


