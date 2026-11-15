import { create } from "zustand";
import type { BerlinConstructionsResponse, BvgReachableResponse } from "../types";

interface FetchedDataState {
  bvgData: BvgReachableResponse | null;
  setBvgData: (bvgData: BvgReachableResponse) => void;

  berlinConstructionsData: BerlinConstructionsResponse | null;
  setBerlinConstructionsData: (data: BerlinConstructionsResponse) => void;
}

const useFetchedDataStore = create<FetchedDataState>((set) => ({
  bvgData: null,
  setBvgData: (data) => set({ bvgData: data }),

  berlinConstructionsData: null,
  setBerlinConstructionsData: (data) => set({ berlinConstructionsData: data }),
}));

export default useFetchedDataStore;
