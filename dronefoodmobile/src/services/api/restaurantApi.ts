import { apiClient } from './client';
import { Restaurant, MenuItem } from '../../types/api';

export async function getRestaurants() {
  const res = await apiClient.get<Restaurant[]>('/restaurants');
  return res.data;
}

export async function getMenuByRestaurant(restaurantId: number) {
  const res = await apiClient.get<MenuItem[]>(`/restaurants/${restaurantId}/menu-items`);
  return res.data;
}
