import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Customer tạo giao dịch thanh toán
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.create(dto, req.user);
  }

  // Xác nhận thanh toán bằng paymentCode
  @Get('confirm')
  confirm(@Query('code') code: string) {
    return this.paymentsService.confirmPayment(code);
  }
}
