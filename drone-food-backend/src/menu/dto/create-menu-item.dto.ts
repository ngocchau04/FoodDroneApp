import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsString()
  imageUrl?: string;
}
