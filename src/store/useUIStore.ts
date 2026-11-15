import { create } from "zustand";
import type { Notification } from "../types";

interface UIState {
  selectedNavOption: string | null;
  setSelectedNavOption: (option: string | null) => void;
  notifications: Notification[];
  setNotification: (notifications: Notification[]) => void;
  addNotification: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isLayersTogglerMinimized: boolean;
  setIsLayersTogglerMinimized: (isLayersTogglerMinimized: boolean) => void;
}

const useUIState = create<UIState>((set) => ({
  selectedNavOption: null,
  setSelectedNavOption: (option) => set({ selectedNavOption: option }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  notifications: [],
  setNotification: (notifications) => set({ notifications }),
  addNotification: (message) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: (state.notifications[state.notifications.length - 1]?.id ?? 0) + 1, message, timestamp: new Date() },
      ],
    })),

  isLayersTogglerMinimized: false,
  setIsLayersTogglerMinimized: (isLayersTogglerMinimized) => set({ isLayersTogglerMinimized }),
}));

export default useUIState;
