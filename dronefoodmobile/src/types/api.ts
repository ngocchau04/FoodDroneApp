// src/types/api.ts
export interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
}

export interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  restaurantId: number;
  totalAmount: number;
  status: string;
}
