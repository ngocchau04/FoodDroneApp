// src/tracking/tracking.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  // Xem lịch sử tracking của 1 order
  @UseGuards(JwtAuthGuard)
  @Get('orders/:orderId')
  async getHistory(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.trackingService.getHistory(orderId);
  }
}
