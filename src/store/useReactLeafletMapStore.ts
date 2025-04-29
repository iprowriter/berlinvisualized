import { create } from "zustand";
import { MapLayer } from "../../server/types";

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
        {id: 'transportation_layer', name: 'bvg',isCluster: true, visible: true, data: [], type: 'marker'},
    ],  

    toggleLayerVisibility: (id) => set((state) => ({
            mapLayers: state.mapLayers.map((layer) =>
                layer.id === id ? { ...layer, visible: !layer.visible } : layer
            ),
        })),

    //Data: Function to update data
    updateLayerData: (id, data) =>
        set((state) => {
          console.log(`Updating ${id} with data:`, data);
          return {
            mapLayers: state.mapLayers.map((layer) =>
              layer.id === id ? { ...layer, data: [...data] } : layer
            ),
          };
        }),
      

}));

export default useReactLeafletMapStore;
