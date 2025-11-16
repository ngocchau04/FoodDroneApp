import { apiClient } from './client';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: 'ADMIN_SV' | 'RESTAURANT' | 'CUSTOMER';
    restaurantId?: number | null;
  };
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return res.data;
}
