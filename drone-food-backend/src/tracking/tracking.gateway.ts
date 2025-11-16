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

@WebSocketGateway({ cors: { origin: '*' }})

export class TrackingGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly trackingService: TrackingService) {}

  @SubscribeMessage('joinOrder')
  handleJoinOrder(@MessageBody() data: { orderId: number }, @ConnectedSocket() client: Socket) {
    const room = `order_${data.orderId}`;
    client.join(room);
    client.emit('joinedOrder', { orderId: data.orderId });
  }

  @SubscribeMessage('updateTracking')
  async handleUpdateTracking(@MessageBody() dto: UpdateTrackingDto) {
    const tracking = await this.trackingService.addTracking(dto);
    const room = `order_${dto.orderId}`;
    this.server.to(room).emit('trackingUpdate', tracking);
    return tracking;
  }
}
