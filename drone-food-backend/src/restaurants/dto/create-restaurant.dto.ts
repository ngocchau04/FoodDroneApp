// src/restaurants/dto/create-restaurant.dto.ts
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsBoolean()
  isActive!: boolean;
}
