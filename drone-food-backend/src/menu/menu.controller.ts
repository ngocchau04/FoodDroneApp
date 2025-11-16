import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Lấy menu của cửa hàng
  @UseGuards(JwtAuthGuard)
  @Get('restaurants/:id/menu-items')
  findByRestaurant(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findByRestaurant(id);
  }

  // Thêm món (Admin hoặc chủ cửa hàng)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('restaurants/:id/menu-items')
  create(
    @Param('id', ParseIntPipe) restaurantId: number,
    @Body() dto: CreateMenuItemDto,
    @Req() req: any
  ) {
    return this.menuService.create(restaurantId, dto, req.user);
  }

  // Sửa món
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('menu-items/:id')
  update(
    @Param('id', ParseIntPipe) itemId: number,
    @Body() dto: UpdateMenuItemDto,
    @Req() req: any
  ) {
    return this.menuService.update(itemId, dto, req.user);
  }

  // Xóa món
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('menu-items/:id')
  remove(
    @Param('id', ParseIntPipe) itemId: number,
    @Req() req: any
  ) {
    return this.menuService.remove(itemId, req.user);
  }
}
