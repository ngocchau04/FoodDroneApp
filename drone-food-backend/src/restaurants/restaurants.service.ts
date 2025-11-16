// src/restaurants/restaurants.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        name: dto.name,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
        phone: dto.phone,
        isActive: dto.isActive,
      },
    });
  }

  async findAll() {
    return this.prisma.restaurant.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException('Không tìm thấy cửa hàng');
    }
    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto) {
    await this.findOne(id); // để ném lỗi NotFound nếu không tồn tại
    return this.prisma.restaurant.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }
}
