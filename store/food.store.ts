// store/food.store.ts
import foodService from "@/services/food.service";
import { Category, MenuItem } from "@/type";
import { isNil } from "lodash";
import { create } from "zustand";

interface FoodState {
  categories: Category[];
  menus: MenuItem[];
  loading: boolean;
  categoryFilter: string;
  queryFilter: string;
  limit: number;

  fetchCategories: () => Promise<void>;
  fetchMenus: (
    overrides?: Partial<{ category: string; query: string; limit: number }>
  ) => Promise<void>;
  setFilters: (
    filters: Partial<{ category: string; query: string; limit: number }>
  ) => void;
}

const useFoodStore = create<FoodState>((set, get) => ({
  categories: [],
  menus: [],
  loading: false,
  categoryFilter: "",
  queryFilter: "",
  limit: 20,

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const res = await foodService.categories();

      set({ categories: res });
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMenus: async (overrides) => {
    try {
      set({ loading: true });
      const filters = {
        category: overrides?.category ?? get().categoryFilter,
        query: overrides?.query ?? get().queryFilter,
        limit: overrides?.limit ?? get().limit,
      };
      const res = await foodService.menus(filters);

      set({ menus: res });
      ``;
    } catch (error) {
      console.error("Failed to fetch menus", error);
    } finally {
      set({ loading: false });
    }
  },

  setFilters: async (value) => {
    const category = typeof value.category === "string" ? value.category : "";
    const query = typeof value.query === "string" ? value.query : "";

    try {
      set({ loading: true });
      const filters = {
        category,
        query,
        limit: 20,
      };
      const res = await foodService.menus(filters);

      set({ menus: res });
    } catch (error) {
      console.error("Failed to fetch menus", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useFoodStore;
