import { create } from "zustand";

import orderService from "@/services/store.service";

import useAuthStore from "./auth.store";

export interface OrderEntity {
  id: string;
  userId: string;
  items: CartItemType[];
  totalPrice: number;
  deliveryFee: number;
  latitude: number;
  longitude: number;
  status: string;
  paths: {
    lat: number;
    lon: number;
  }[];
  distance: number;
  deliveryCoord: {
    lat: number;
    lon: number;
  };
}

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SHIPPER = "SHIPPER",
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItemType {
  id: string; // menu item id
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  customizations?: CartCustomization[];
}

type ShipperState = {
  orders: OrderEntity[];
  count: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: OrderEntity | null;

  fetchPendingOrders: (page?: number, limit?: number) => Promise<void>;
  clearOrders: () => void;
  acceptOrder: (cartId: string) => Promise<void>;
  getCurrentOrder: () => Promise<void>;
  completeOrder: () => Promise<void>;
};

export const useShipperStore = create<ShipperState>((set, get) => ({
  orders: [],
  count: 0,
  isLoading: false,
  error: null,
  currentOrder: null,

  fetchPendingOrders: async (page = 1, limit = 20) => {
    const { user } = useAuthStore.getState();

    if (!user || user.role !== Role.SHIPPER) {
      console.log("User is not a shipper. Skipping fetch.");
      set({ orders: [], count: 0 });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await orderService.fetchAllPendingOrders(page, limit);

      console.log("order: ", response);

      set({
        orders: response.items,
        count: response.count,
      });
    } catch (err: any) {
      console.error("fetchPendingOrders error", err);
      set({ error: err.message || "Failed to fetch orders" });
    } finally {
      set({ isLoading: false });
    }
  },

  clearOrders: () => set({ orders: [], count: 0, error: null }),

  acceptOrder: async (cartId: string) => {
    set({ isLoading: true, error: null });
    try {
      await orderService.acceptOrder(cartId);

      await get().fetchPendingOrders();
    } catch (err: any) {
      set({ error: err.message || "Failed to accept order" });
    } finally {
      set({ isLoading: false });
    }
  },

  getCurrentOrder: async () => {
    set({ isLoading: true, error: null });

    try {
      const order = await orderService.currentOrder();

      set({ currentOrder: order });
    } catch (err: any) {
      console.log(err);
      set({ error: err?.message });
    } finally {
      set({ isLoading: false });
    }
  },

  completeOrder: async () => {
    try {
    } catch (err) {
      console.error(err);
    }
  },
}));
