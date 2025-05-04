import { create } from "zustand";

// Define the state shape
interface UIState {
    selectedNavOption: string | null;
    setSelectedNavOption: (option: string | null) => void;
    notifications: { id: number, message: string, timestamp: Date }[];
    setNotification: (notifications: { id: number, message: string, timestamp: Date }[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isLayersTogglerMinimized: boolean;
    setIsLayersTogglerMinimized: (isLayersTogglerMinimized: boolean) => void;

}

// Create the store
const useUIState = create<UIState>((set) => ({
    selectedNavOption: null,  // Initial state
    setSelectedNavOption: (option) => set({ selectedNavOption: option }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading: isLoading }),

    notifications: [],
    setNotification: (notification) => set({ notifications: notification }),

    isLayersTogglerMinimized: false,
    setIsLayersTogglerMinimized: (isLayersTogglerMinimized) => set({ isLayersTogglerMinimized: isLayersTogglerMinimized }),
}));

export default useUIState;
