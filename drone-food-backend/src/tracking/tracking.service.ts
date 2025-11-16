// src/tracking/tracking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async addTracking(dto: UpdateTrackingDto) {
    // đảm bảo order tồn tại
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const tracking = await this.prisma.tracking.create({
      data: {
        orderId: dto.orderId,
        lat: dto.lat,
        lng: dto.lng,
        status: dto.status,
      },
    });

    return tracking;
  }

  async getHistory(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.prisma.tracking.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
