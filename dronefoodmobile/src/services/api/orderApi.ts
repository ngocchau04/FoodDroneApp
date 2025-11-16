import { apiClient } from './client';
import { OrderItemInput, OrderResponse, Order } from '../../types/api';

interface CreateOrderPayload {
  restaurantId: number;
  totalAmount: number;
  items: OrderItemInput[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await apiClient.post<OrderResponse>('/orders', payload);
  return res.data;
}

export async function getMyOrders() {
  const res = await apiClient.get<Order[]>('/orders/me');
  return res.data;
}
