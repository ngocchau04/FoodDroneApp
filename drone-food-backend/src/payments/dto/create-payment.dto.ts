import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsNumber()
  orderId!: number;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNumber()
  amount!: number;
}
