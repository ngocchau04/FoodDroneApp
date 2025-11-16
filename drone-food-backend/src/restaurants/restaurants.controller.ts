// src/restaurants/restaurants.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Ai cũng có thể xem danh sách cửa hàng
  // Nếu muốn "public" hoàn toàn, có thể bỏ UseGuards ở đây
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.restaurantsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findOne(id);
  }

  // Chỉ ADMIN_SV mới được thêm cửa hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SV)
  @Post()
  async create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  // Chỉ ADMIN_SV mới được sửa cửa hàng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SV)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, dto);
  }

  // Chỉ ADMIN_SV mới được xóa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_SV)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.remove(id);
  }
}
