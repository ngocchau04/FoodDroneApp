import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRestaurant(restaurantId: number) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { id: 'asc' }
    });
  }

  async create(restaurantId: number, dto: CreateMenuItemDto, user: any) {
    // Chỉ admin hoặc chủ cửa hàng được thêm món
    if (user.role !== 'ADMIN_SV' && user.restaurantId !== restaurantId) {
      throw new ForbiddenException('Bạn không có quyền thêm món cho cửa hàng này');
    }

    return this.prisma.menuItem.create({
      data: {
        restaurantId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
      }
    });
  }

  async update(itemId: number, dto: UpdateMenuItemDto, user: any) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId }
    });

    if (!item) throw new NotFoundException('Không tìm thấy món ăn');

    // Chỉ admin hoặc chủ cửa hàng được sửa
    if (user.role !== 'ADMIN_SV' && user.restaurantId !== item.restaurantId) {
      throw new ForbiddenException('Bạn không có quyền sửa món này');
    }

    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: dto
    });
  }

  async remove(itemId: number, user: any) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id: itemId }
    });

    if (!item) throw new NotFoundException('Không tìm thấy món ăn');

    if (user.role !== 'ADMIN_SV' && user.restaurantId !== item.restaurantId) {
      throw new ForbiddenException('Bạn không được xóa món này');
    }

    return this.prisma.menuItem.delete({ where: { id: itemId } });
  }
}
