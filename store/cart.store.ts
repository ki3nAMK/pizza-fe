import { isNil } from "lodash";
import { create } from "zustand";

import orderService from "@/services/store.service";
import { CartCustomization, CartStore, CreateOrderRequest } from "@/type";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";

function areCustomizationsEqual(
  a: CartCustomization[] = [],
  b: CartCustomization[] = []
): boolean {
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
  const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

  return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],

  fetchAllOrder: async () => {
    try {
      const res = await orderService.fetchAll();

      console.log(res);

      set({
        orders: res.items,
      });
    } catch (err) {
      console.log("Error while fetch order: ", err);
    }
  },

  createOrder: async (data: CreateOrderRequest, onSuccess: VoidFunction) => {
    try {
      await orderService.menus(data);

      const res = await orderService.fetchAll();

      set({
        orders: res.items,
        items: [],
      });

      onSuccess();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Failed to createOrder."
      );
      console.log("Error while create order: ", err);
    }
  },

  addItem: (item, quantity?: number) => {
    const customizations = item.customizations ?? [];
    const cart = get().items;

    const itemStoreId = item.store?.id;

    if (cart.length > 0) {
      const cartStoreId = cart[0].store?.id;

      if (itemStoreId !== cartStoreId) {
        Toast.show({
          type: "error",
          text1: "Không thể thêm món",
          text2: "Bạn chỉ có thể thêm món từ cùng 1 cửa hàng vào giỏ hàng",
          position: "bottom",
        });
        return;
      }
    }

    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      set({
        items: cart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (isNil(quantity) ? 1 : quantity) }
            : i
        ),
      });
    } else {
      set({
        items: [
          ...cart,
          { ...item, quantity: isNil(quantity) ? 1 : quantity, customizations },
        ],
      });
    }
  },

  removeItem: (id, customizations = []) => {
    set({
      items: get().items.filter(
        (i) =>
          !(
            i.id === id &&
            areCustomizationsEqual(i.customizations ?? [], customizations)
          )
      ),
    });
  },

  increaseQty: (id, customizations = []) => {
    set({
      items: get().items.map((i) =>
        i.id === id &&
        areCustomizationsEqual(i.customizations ?? [], customizations)
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    });
  },

  decreaseQty: (id, customizations = []) => {
    set({
      items: get()
        .items.map((i) =>
          i.id === id &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => {
      const base = item.price;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization) => s + c.price,
          0
        ) ?? 0;
      return total + item.quantity * (base + customPrice);
    }, 0),
}));
