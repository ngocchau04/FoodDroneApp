import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // Customer tạo yêu cầu thanh toán
  async create(dto: CreatePaymentDto, user: any) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order không tồn tại');
    }

    // LẤY userId từ token (JwtStrategy return { userId, email, role, restaurantId })
    const currentUserId = Number(user.userId ?? user.id);
    if (!currentUserId) {
      throw new BadRequestException('Không xác định được user hiện tại');
    }

    // Chỉ customer tạo đơn mới được thanh toán
    if (order.customerId !== currentUserId) {
      throw new BadRequestException('Bạn không thể thanh toán đơn của người khác');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Đơn hàng đã thanh toán hoặc không hợp lệ');
    }

    if (dto.amount !== order.totalAmount) {
      throw new BadRequestException('Số tiền thanh toán không khớp với đơn hàng');
    }

    // Tạo mã xác nhận thanh toán 6 số
    const paymentCode =
      Math.floor(100000 + Math.random() * 900000).toString();

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: dto.amount,
        method: dto.method as PaymentMethod,
        status: PaymentStatus.PENDING,
        paymentCode, // lưu mã xác nhận vào payment
      },
    });

    const qrImage = await this.generateQrCode(paymentCode);

    return {
      message: 'Tạo giao dịch thành công',
      paymentId: payment.id,
      paymentCode,          // mã xác nhận thanh toán gửi cho mobile
      qrImage,              // hình ảnh QR code gửi cho mobile
      method: dto.method,
      amount: dto.amount,
    };
  }

  async generateQrCode(paymentCode: string) {
    // const qrData = `PAYMENT:${paymentCode}`;
    // return await QRCode.toDataURL(qrData);
    const text = `PAYMENT:${paymentCode}`; // nội dung bên trong QR
    // Trả về data URL dạng: data:image/png;base64,....
    return QRCode.toDataURL(text);
  }

  // Xác nhận thanh toán bằng mã (mô phỏng callback hoặc user nhập mã)
  async confirmPayment(paymentCode: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { paymentCode },
    });

    if (!payment) {
      throw new NotFoundException('Không tìm thấy giao dịch với mã này');
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      return {
        message: 'Giao dịch đã được xác nhận trước đó',
        orderId: payment.orderId,
      };
    }

    // 1. Update payment -> SUCCESS
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCESS },
    });

    // 2. Update order -> PAID + lưu paymentCode
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: OrderStatus.PAID,
        paymentCode, // Order đã có field paymentCode
      },
    });

    return {
      message: 'Thanh toán thành công',
      orderId: payment.orderId,
      paymentCode,
    };
  }
}
