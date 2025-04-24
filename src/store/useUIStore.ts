import { create } from "zustand";

// Define the state shape
interface UIState {
    selectedNavOption: string | null;
    setSelectedNavOption: (option: string | null) => void;
    notifications: { id: number, message: string, timestamp: Date }[];
    setNotification: (notifications: { id: number, message: string, timestamp: Date }[]) => void;

}

// Create the store
const useUIState = create<UIState>((set) => ({
    selectedNavOption: null,  // Initial state
    setSelectedNavOption: (option) => set({ selectedNavOption: option }),

    notifications: [],
    setNotification: (notification) => set({ notifications: notification }),
}));

export default useUIState;
