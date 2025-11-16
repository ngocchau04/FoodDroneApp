import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, user: any) {
    if (user.role !== 'CUSTOMER') {
      throw new ForbiddenException('Chỉ khách hàng mới được đặt đơn');
    }

    // Kiểm tra cửa hàng tồn tại
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) throw new NotFoundException('Cửa hàng không tồn tại');

    // const order = await this.prisma.order.create({
    //   data: {
    //     customerId: user.userId,
    //     restaurantId: dto.restaurantId,
    //     totalAmount: dto.totalAmount,
    //     status: OrderStatus.PENDING,
    //     items: {
    //       create: dto.items.map((item) => ({
    //         menuItemId: item.menuItemId,
    //         quantity: item.quantity,
    //         unitPrice: item.unitPrice,
    //       })),
    //     },
    //   },
    //   include: { items: true },
    // });

    const currentUserId = Number(user.userId ?? user.id);

    const order = await this.prisma.order.create({
      data: {
        customerId: currentUserId,
        restaurantId: dto.restaurantId,
        totalAmount: dto.totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: dto.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    console.log('DTO nhận được:', dto);

    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: dto.items.map(i => i.menuItemId) }
      }
    });
    console.log('Menu items tìm được trong DB:', menuItems);

    return order;
  }

  async findMyOrders(user: any) {
    const currentUserId = Number(user.userId ?? user.id);

    return this.prisma.order.findMany({
      where: { customerId: currentUserId },
      include: { restaurant: true, items: true },
      orderBy: { id: 'desc' },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async findOne(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, restaurant: true },
    });
  }

  async findRestaurantOrders(restaurantId: number) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: { items: true, customer: true },
      orderBy: { id: 'desc' },
    });
  }
}
