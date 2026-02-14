import { create } from 'zustand';

interface AdsState {
    isIdle: boolean;
    setIdle: (idle: boolean) => void;
}

export const useAdsStore = create<AdsState>((set) => ({
    isIdle: false,
    setIdle: (idle) => set({ isIdle: idle }),
}));
