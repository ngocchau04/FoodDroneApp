// src/tracking/dto/update-tracking.dto.ts
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTrackingDto {
  @IsInt()
  orderId!: number;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsString()
  @IsNotEmpty()
  status!: string; // ví dụ: "Drone đã cất cánh", "Đang giao", "Đã giao"
}
