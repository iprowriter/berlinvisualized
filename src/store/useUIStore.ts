import { create } from "zustand";
import type { Notification, View } from "../types";

interface UIState {
  selectedView: View;
  setSelectedView: (view: View) => void;
  /** A search typed on the Overview page, picked up and run by SearchMap when it mounts. */
  pendingSearch: string | null;
  setPendingSearch: (query: string | null) => void;
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
  selectedView: "overview",
  setSelectedView: (selectedView) => set({ selectedView }),
  pendingSearch: null,
  setPendingSearch: (pendingSearch) => set({ pendingSearch }),

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
