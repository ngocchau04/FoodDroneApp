// src/tracking/tracking.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // cho phép tất cả, sau có thể siết lại domain/app
  },
})
export class TrackingGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly trackingService: TrackingService) {}

  // Client join vào room theo orderId (customer app)
  @SubscribeMessage('joinOrder')
  handleJoinOrder(
    @MessageBody() data: { orderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `order_${data.orderId}`;
    client.join(room);
    // có thể trả lời lại client
    client.emit('joinedOrder', { orderId: data.orderId });
  }

  // Drone / server mô phỏng gửi update tracking
  @SubscribeMessage('updateTracking')
  async handleUpdateTracking(
    @MessageBody() dto: UpdateTrackingDto,
  ) {
    // 1. Lưu DB
    const tracking = await this.trackingService.addTracking(dto);

    // 2. Emit cho tất cả client đang xem đơn này
    const room = `order_${dto.orderId}`;
    this.server.to(room).emit('trackingUpdate', tracking);

    return tracking;
  }
}
