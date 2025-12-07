import { http } from '@/lib/request/base-request';
import {
  CreateOrderRequest,
  OrderEntity,
} from '@/type';

const orderService = {
  fetchAll: (): Promise<{ count: number; items: OrderEntity[] }> =>
    http.axios.request({
      method: "GET",
      url: `carts`,
    }),

  menus: (data: CreateOrderRequest): Promise<OrderEntity> =>
    http.axios.request({
      method: "POST",
      url: `carts`,
      data,
    }),

  fetchAllPendingOrders: (
    page = 1,
    limit = 20
  ): Promise<{ count: number; items: OrderEntity[] }> =>
    http.axios.request({
      method: "GET",
      url: `carts/pending-shipment`,
      params: { page, limit },
    }),

  acceptOrder: (cartId: string) =>
    http.axios.request({
      method: "POST",
      url: `carts/${cartId}/accept`,
    }),

  currentOrder: (): Promise<OrderEntity> =>
    http.axios.request({
      method: "GET",
      url: `carts/current`,
    }),
};

export default orderService;
