import { create } from "zustand";
import { MapLayer } from "../../server/types";
import BvgTransportationLayer from "../components/Bvg/Bvg";
import BerlinConstructionsLayer from "../components/BerlinConstruction/BerlinConstructions";



// Define the state shape
interface ReactLeafletState {
    mapLayers: MapLayer[];
    toggleLayerVisibility: (id: string) => void;
    updateLayerData: (id: string, data: any[]) => void;

}



// Create the store
const useReactLeafletMapStore = create<ReactLeafletState>((set) => ({
    mapLayers: [
        {id: 'location_layer', name: 'location', isCluster: false, visible: true, data: [], type: 'marker' as 'marker'},
        {id: 'transportation_layer', name: 'bvg',isCluster: true, visible: true, data: [],type: 'marker',  renderMarker: (item: any, index: number) => {
          return <BvgTransportationLayer item={item} index={index} />;
        },},
        {id: 'berlin_construction_layer', name: 'road_constructions',isCluster: true, visible: true, data: [],type: 'marker',  renderMarker: (item: any, index: number) => {
          return <BerlinConstructionsLayer item={item} index={index} />;
        },},
    ],  

    toggleLayerVisibility: (id) => set((state) => ({
            mapLayers: state.mapLayers.map((layer) =>
                layer.id === id ? { ...layer, visible: !layer.visible } : layer
            ),
        })),

    //Data: Function to update data
    updateLayerData: (id, data) =>
      set((state) => {
        if (!Array.isArray(data)) {
          console.error(`updateLayerData error: expected array but got`, data);
          return {}; // no state update
        }
    
        return {
          mapLayers: state.mapLayers.map((layer) =>
            layer.id === id ? { ...layer, data: [...data] } : layer
          ),
        };
      }),
      

}));

export default useReactLeafletMapStore;
