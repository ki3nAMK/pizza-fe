import { create } from 'zustand';

import { removeTokens } from '@/lib/helper';
import {
  getSocketClient,
  socketInstances,
  SocketNamespace,
} from '@/lib/socket';
import authService from '@/services/auth.service';
import { User } from '@/type';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: async (user) => {
    set({ user });

    if (user?.role === "SHIPPER") {
      const socket = await getSocketClient(SocketNamespace.SHIPPER);

      if (!socket) return;

      socket.on("connect", () => {
        console.log("🚀 Socket SHIPPER is actually connected!");
      });

      socket.connect();
    }
  },

  setLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getMe();
      if (user) {
        set({ isAuthenticated: true });
        await useAuthStore.getState().setUser(user);
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (e) {
      console.log("fetchAuthenticatedUser error", e);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await removeTokens();
    set({ user: null, isAuthenticated: false });

    const socket = socketInstances[SocketNamespace.SHIPPER];
    socket?.disconnect();
    console.log("❌ SHIPPER socket disconnected");
  },
}));

export default useAuthStore;
