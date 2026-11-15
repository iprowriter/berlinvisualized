import { create } from "zustand";
import type { BvgStation, LayerItem, MapLayer, NearbyFeature } from "../types";
import BvgTransportationLayer from "../components/Bvg/Bvg";
import BerlinConstructionsLayer from "../components/BerlinConstruction/BerlinConstructions";

interface ReactLeafletState {
  mapLayers: MapLayer[];
  toggleLayerVisibility: (id: string) => void;
  updateLayerData: (id: string, data: LayerItem[]) => void;
}

export const initialMapLayers: MapLayer[] = [
  { id: "location_layer", name: "location", isCluster: false, visible: true, data: [], type: "marker" },
  {
    id: "transportation_layer",
    name: "bvg",
    isCluster: true,
    visible: true,
    data: [],
    type: "marker",
    // This layer only ever receives BvgStation items (see SearchMap).
    renderMarker: (item, index) => <BvgTransportationLayer item={item as BvgStation} index={index} />,
  },
  {
    id: "berlin_construction_layer",
    name: "road_constructions",
    isCluster: true,
    visible: true,
    data: [],
    type: "marker",
    // This layer only ever receives NearbyFeature items (see SearchMap).
    renderMarker: (item, index) => <BerlinConstructionsLayer item={item as NearbyFeature} index={index} />,
  },
];

const useReactLeafletMapStore = create<ReactLeafletState>((set) => ({
  mapLayers: initialMapLayers,

  toggleLayerVisibility: (id) =>
    set((state) => ({
      mapLayers: state.mapLayers.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer)),
    })),

  updateLayerData: (id, data) =>
    set((state) => {
      if (!Array.isArray(data)) {
        console.error("updateLayerData error: expected array but got", data);
        return {};
      }
      return {
        mapLayers: state.mapLayers.map((layer) => (layer.id === id ? { ...layer, data: [...data] } : layer)),
      };
    }),
}));

export default useReactLeafletMapStore;
