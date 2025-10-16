import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket, RemoteSocket } from 'socket.io';
import { TokenService } from '@core/domain/ports';

@WebSocketGateway({
  cors: {
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos
  private tokenCheckInterval: NodeJS.Timeout;

  constructor(private readonly tokenService: TokenService) {}

  afterInit() {
    this.tokenCheckInterval = setInterval(() => {
      this.validateAllConnections();
    }, this.TOKEN_CHECK_INTERVAL);

    this.logger.log('Gateway initialized with token validation');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.warn(`Client ${client.id} rejected: No token provided`);
        client.disconnect();
        return;
      }

      const payload = await this.tokenService.verify(token);
      const userId = payload.userId;

      if (!userId) {
        this.logger.warn(`Client ${client.id} rejected: Invalid token payload`);
        client.disconnect();
        return;
      }

      client.data.userId = userId;
      client.data.token = token;

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

  private async validateAllConnections() {
    const sockets = await this.server.fetchSockets();
    this.logger.log(`Validating ${sockets.length} active connections...`);

    for (const socket of sockets) {
      await this.validateClientToken(socket);
    }
  }

  private async validateClientToken(
    client: RemoteSocket<any, any> | Socket,
  ) {
    const token = client.data.token as string;
    const userId = client.data.userId as string;

    if (!token) {
      this.logger.warn(`Client ${client.id} has no token, disconnecting`);
      this.server.to(client.id).disconnectSockets();
      return;
    }

    try {
      const payload = await this.tokenService.verify(token);

      if (!payload || payload.userId !== userId) {
        throw new Error('Token invalid or userId mismatch');
      }
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} (user: ${userId}) token expired or invalid, disconnecting`,
      );

      this.server.to(client.id).emit('token:expired', {
        message: 'Your session has expired. Please reconnect.',
      });

      setTimeout(() => {
        this.server.to(client.id).disconnectSockets();
      }, 100);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.logger.log(`Client ${client.id} disconnected (user: ${userId})`);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(userId).emit(event, data);
  }

  emitToUsers(userIds: string[], event: string, data: any) {
    userIds.forEach((userId) => {
      this.server.to(userId).emit(event, JSON.stringify(data));
    });
  }
}
