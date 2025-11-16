import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  menuItemId!: number;

  @IsInt()
  quantity!: number;

  @IsInt()
  unitPrice!: number;
}

export class CreateOrderDto {
  @IsInt()
  restaurantId!: number;

  @IsInt()
  totalAmount!: number;   // ✅ Dùng totalAmount, KHÔNG phải totalPrice

  @IsArray()
  @IsNotEmpty()
  items!: CreateOrderItemDto[];
}
