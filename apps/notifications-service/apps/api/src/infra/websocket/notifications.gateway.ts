import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly jwtSecret = process.env.JWT_SECRET || '';

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.warn(`Client ${client.id} rejected: No token provided`);
        client.disconnect();
        return;
      }

      if (!this.jwtSecret) {
        this.logger.error('JWT_SECRET not configured');
        client.disconnect();
        return;
      }

      const decoded = jwt.verify(token, this.jwtSecret);
      const payload = decoded as JwtPayload;
      const userId = payload.userId;

      if (!userId) {
        this.logger.warn(`Client ${client.id} rejected: Invalid token payload`);
        client.disconnect();
        return;
      }

      client.data.userId = userId;

      await client.join(userId);
      await client.join(userId);

      this.logger.log(`Client ${client.id} connected as user ${userId}`);

      client.emit('connected', { userId });
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`Client ${client.id} disconnected (user: ${userId})`);
  }

  emitToAll(event: string, data: any) {
    this.logger.log(`Emitting event ${event} to all clients`);
    this.server.emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.logger.log(`Emitting event ${event} to user ${userId}`);
    this.server.to(userId).emit(event, data);
  }

  emitToUsers(userIds: string[], event: string, data: any) {
    this.logger.log(
      `Emitting event ${event} to ${userIds.length} users: ${userIds.join(', ')}`,
    );
    userIds.forEach((userId) => {
      this.server.to(userId).emit(event, JSON.stringify(data));
    });
  }
}
