import { apiClient } from './client';
import { OrderItemInput, OrderResponse } from '../../types/api';

interface CreateOrderPayload {
  restaurantId: number;
  totalAmount: number;
  items: OrderItemInput[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await apiClient.post<OrderResponse>('/orders', payload);
  return res.data;
}
