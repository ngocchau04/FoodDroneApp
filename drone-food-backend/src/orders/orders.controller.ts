import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Role } from '@prisma/client';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyOrders(@Req() req: any) {
    return this.ordersService.findMyOrders(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.RESTAURANT)
  @Get('restaurant')
  findRestaurantOrders(@Req() req: any) {
    return this.ordersService.findRestaurantOrders(req.user.restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SV, Role.RESTAURANT)
  @Patch(':id/status/:status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
