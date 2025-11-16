// src/services/api/paymentApi.ts
import { apiClient } from './client';

export type PaymentMethod = 'MOMO' | 'VNPAY';

export interface CreatePaymentPayload {
  orderId: number;
  method: PaymentMethod;
  amount: number;
}

export interface CreatePaymentResponse {
  message: string;
  paymentId: number;
  paymentCode: string;
  method: PaymentMethod;
  amount: number;
  qrImage: string;
}

export interface ConfirmPaymentResponse {
  message: string;
  orderId: number;
  paymentCode: string;
}

export async function createPayment(payload: CreatePaymentPayload) {
  const res = await apiClient.post<CreatePaymentResponse>('/payments', payload);
  return res.data;
}

export async function confirmPayment(code: string) {
  const res = await apiClient.get<ConfirmPaymentResponse>(
    `/payments/confirm`,
    { params: { code } },
  );
  return res.data;
}
