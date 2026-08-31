import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // We'll reuse the jwtConstants from AuthModule or decode it loosely.
      // For MVP, we decode it directly (in production, verify signature)
      const decoded: any = this.jwtService.decode(token as string);
      
      if (!decoded || !decoded.companyId) {
        client.disconnect();
        return;
      }

      const companyRoom = `company_${decoded.companyId}`;
      client.join(companyRoom);
      
      this.logger.log(`Client connected: ${client.id} to room ${companyRoom}`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Called from WhatsappService when a new message arrives
  emitNewMessage(companyId: string, message: any) {
    this.server.to(`company_${companyId}`).emit('newMessage', message);
  }
}
