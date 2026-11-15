import { beforeEach, describe, expect, it, vi } from "vitest";
import useReactLeafletMapStore, { initialMapLayers } from "./useReactLeafletMapStore";

const layer = (id: string) => useReactLeafletMapStore.getState().mapLayers.find((l) => l.id === id)!;

describe("useReactLeafletMapStore", () => {
  beforeEach(() => useReactLeafletMapStore.setState({ mapLayers: initialMapLayers }));

  it("starts with the location, transport and construction layers visible", () => {
    const ids = useReactLeafletMapStore.getState().mapLayers.map((l) => l.id);
    expect(ids).toEqual(["location_layer", "transportation_layer", "berlin_construction_layer"]);
    expect(useReactLeafletMapStore.getState().mapLayers.every((l) => l.visible)).toBe(true);
  });

  it("toggles visibility of only the given layer", () => {
    useReactLeafletMapStore.getState().toggleLayerVisibility("transportation_layer");
    expect(layer("transportation_layer").visible).toBe(false);
    expect(layer("location_layer").visible).toBe(true);

    useReactLeafletMapStore.getState().toggleLayerVisibility("transportation_layer");
    expect(layer("transportation_layer").visible).toBe(true);
  });

  it("replaces the data of only the given layer", () => {
    const location = [{ latitude: 52.52, longitude: 13.405, display_name: "Berlin" }];
    useReactLeafletMapStore.getState().updateLayerData("location_layer", location);

    expect(layer("location_layer").data).toEqual(location);
    expect(layer("location_layer").data).not.toBe(location); // copied, not shared
    expect(layer("transportation_layer").data).toEqual([]);
  });

  it("ignores non-array data", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    // @ts-expect-error: deliberately passing invalid data
    useReactLeafletMapStore.getState().updateLayerData("location_layer", null);
    expect(layer("location_layer").data).toEqual([]);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});
