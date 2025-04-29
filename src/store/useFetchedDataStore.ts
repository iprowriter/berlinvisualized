import { create } from "zustand";

// Define the state shape
interface FetchedDataState {
    bvgData: any[] | null;
    setBvgData: (bvgData: any[]) => void;
}

// Create the store
const useFetchedDataStore = create<FetchedDataState>((set) => ({
    bvgData: null,
    setBvgData: (data) => set({ bvgData: data }),
    


      

}));

export default useFetchedDataStore;
