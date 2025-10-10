import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { LiveTrackingService } from './live-tracking.service';
import { TrackingData } from './dto/tracking-data.dto';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@WebSocketGateway({ cors: { origin: '*' } })
export class LiveTrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private pubClient: Redis;
  private subClient: Redis;

  constructor(
    @Inject(forwardRef(() => LiveTrackingService))
    private readonly trackingService: LiveTrackingService,
  ) {}

  async afterInit() {
    const redisEnabled =
      String(process.env.REDIS_ENABLED || 'false').toLowerCase() === 'true';
    if (!redisEnabled) {
      console.warn(
        'Redis disabled. Proceeding without Socket.IO Redis adapter.',
      );
      return;
    }

    this.pubClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    this.subClient = this.pubClient.duplicate();

    try {
      await this.pubClient.connect();
      await this.subClient.connect();
      this.server.adapter(createAdapter(this.pubClient, this.subClient));
      console.log('Socket.IO Redis adapter enabled.');
    } catch (error) {
      console.warn(
        'Redis not available, proceeding without adapter:',
        (error as Error).message,
      );
    }
  }

  // When client connects
  handleConnection(client: Socket) {
    const role = String(client.handshake.query.role ?? '');
    const busId = String(client.handshake.query.busId ?? '');
    console.log(
      `✅ Client connected: ${client.id}, role=${role}, busId=${busId}`,
    );
  }

  // When client disconnects
  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // Client joins a bus room
  @SubscribeMessage('joinBusRoom')
  handleJoinRoom(
    @MessageBody() data: { busId: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`bus-${data.busId}`);
    console.log(`🚍 ${client.id} joined bus-${data.busId}`);
  }

  // Client sends live location
  @SubscribeMessage('sendLocation')
  handleSendLocation(
    @MessageBody()
    data: { busId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📍 Received location from', client.id, ':', data);

    // Broadcast location to that bus room
    this.server.to(`bus-${data.busId}`).emit('busLocationUpdate', data);
  }

  // Optional: save location to DB and broadcast
  @SubscribeMessage('updateLocation')
  async handleUpdate(@MessageBody() data: TrackingData) {
    await this.trackingService.saveAndBroadcast({
      ...data,
      recorded_at: new Date(),
    });
  }
}
