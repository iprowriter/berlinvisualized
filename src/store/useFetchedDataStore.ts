import { create } from "zustand";

// Define the state shape
interface FetchedDataState {
    bvgData: any[] | null;
    setBvgData: (bvgData: any[]) => void;

    berlinConstructionsData: any[] | null;
    setBerlinConstructionsData: (bvgData: any[]) => void;
}

// Create the store
const useFetchedDataStore = create<FetchedDataState>((set) => ({
    bvgData: null,
    setBvgData: (data) => set({ bvgData: data }),

    berlinConstructionsData: null,
    setBerlinConstructionsData:  (data) => set({ berlinConstructionsData: data }),

}));

export default useFetchedDataStore;
