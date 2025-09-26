import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { type AuthState, type User } from '@/commons/types';
import { KEYS } from '@/commons/key';

// Replace with the old key you want to remove
const OLD_KEY = '';

if (OLD_KEY && OLD_KEY !== KEYS.AUTH_STORAGE) {
  localStorage.removeItem(OLD_KEY);
}

interface Auth extends AuthState {
  token: string | null;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<Auth>()(
  persist(
    set => ({
      token: null,
      user: null,
      userData: [],
      login: (user: User) => set({ user, token: user.accessToken }),
      register: (user: User) =>
        set(state => ({
          user,
          token: user.accessToken,
          userData: [...state.userData, user],
        })),
      logout: () => set({ user: null, token: null }),
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
