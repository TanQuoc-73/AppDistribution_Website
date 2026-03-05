import { create } from "zustand";

interface UiState {
    isSidebarOpen: boolean;
    isModalOpen: boolean;
    toggleSidebar: () => void;
    toggleModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
    isSidebarOpen: false,
    isModalOpen: false,

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
}));
