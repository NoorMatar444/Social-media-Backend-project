import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuthType } from 'src/common/interfaces/socket.interface';
import { TokenService } from 'src/common/services/token.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: '/notification',
})
export class NotificationGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;
  constructor(private readonly tokenService: TokenService) {}
  private readonly logger = new Logger(NotificationGateWay.name);
  async handleConnection(client: SocketAuthType) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        throw new BadRequestException('token not found');
      }
      const { user, verifiedToken } = await this.tokenService.checkToken(token);
      // ensure we have valid values before assigning to socket data
      if (!user || !verifiedToken) {
        throw new NotFoundException('invalid token payload');
      }

      client.data = {
        user,
        verifiedToken,
      };
      const userId = user._id.toString();
      await client.join(this.getUserRoom(userId));
      this.logger.log(`client connected ${client.id} (user:${userId})`);
    } catch {
      this.logger.warn(`client disconnect ${client.id}`);
      client.disconnect();
    }
  }
  getUserRoom(userId: string) {
    return `userId:${userId}`;
  }
  handleDisconnect(client: SocketAuthType) {
    this.logger.log(`client disconnected ${client.id}`);
  }
  sendToUser(userId: string, payload: unknown) {
    this.server.to(this.getUserRoom(userId)).emit('notification', payload);
  }
}
