export type UserRole = 'ADMIN_SV' | 'RESTAURANT' | 'CUSTOMER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  restaurantId?: number | null;
}
