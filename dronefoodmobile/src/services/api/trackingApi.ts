import { apiClient } from './client';

export interface TrackingPoint {
  id: number;
  orderId: number;
  lat: number;
  lng: number;
  status: string;
  createdAt: string;
}

export async function getTrackingHistory(orderId: number) {
  const res = await apiClient.get<TrackingPoint[]>(`/tracking/orders/${orderId}`);
  return res.data;
}
