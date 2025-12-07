import { http } from "@/lib/request/base-request";
import { Category } from "@/type";

const foodService = {
    categories: (): Promise<Category[]> =>
        http.axios.request({
            method: 'GET',
            url: `foods/categories`,
        }),

    menus: (filters?: { category?: string; query?: string; limit?: number }): Promise<any> =>
        http.axios.request({
            method: 'GET',
            url: `foods/menu`,
            params: filters,
        }),
};

export default foodService;
