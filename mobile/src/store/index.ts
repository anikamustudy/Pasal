import { create } from 'zustand';
import { User, Shop } from '../types';

interface AppStore {
  // Authentication state
  isAuthenticated: boolean;
  user: User | null;
  shop: Shop | null;
  
  // App state
  isPinSet: boolean;
  isPinLocked: boolean;
  lastSyncTimestamp: string | null;
  isOnline: boolean;
  isSyncing: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setShop: (shop: Shop | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setPinSet: (isPinSet: boolean) => void;
  setPinLocked: (isPinLocked: boolean) => void;
  setLastSyncTimestamp: (timestamp: string | null) => void;
  setOnline: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  shop: null,
  isPinSet: false,
  isPinLocked: false,
  lastSyncTimestamp: null,
  isOnline: true,
  isSyncing: false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setShop: (shop) => set({ shop }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setPinSet: (isPinSet) => set({ isPinSet }),
  setPinLocked: (isPinLocked) => set({ isPinLocked }),
  setLastSyncTimestamp: (lastSyncTimestamp) => set({ lastSyncTimestamp }),
  setOnline: (isOnline) => set({ isOnline }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  logout: () => set({
    isAuthenticated: false,
    user: null,
    shop: null,
    lastSyncTimestamp: null,
  }),
}));

export default useAppStore;
