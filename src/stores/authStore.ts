import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { type AuthState } from '@/lib/auth';
import { KEYS } from "@/commons/key";

// Replace with the old key you want to remove
const OLD_KEY = "";

if (OLD_KEY !== KEYS.AUTH_STORAGE) {
  localStorage.removeItem(OLD_KEY);
}

interface Auth extends AuthState {
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<Auth>()(
  persist(
    set => ({
      user: null,
      setUser: (user: AuthState['user']) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: KEYS.AUTH_STORAGE,
      storage: createJSONStorage(() => localStorage),

      partialize: (state: Auth) => {
        return state;
      },

      // Optional: Migration handling for type changes
      migrate: (persistedState, version) => {
        console.log('🚀 ~ version:', version);
        // Handle potential state migrations here
        return persistedState;
      },
    }
  )
);
