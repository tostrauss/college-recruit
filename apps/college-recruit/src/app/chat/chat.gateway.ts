import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    client.join(`match:${data.matchId}`);
    return { event: 'joined', room: data.matchId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    client.leave(`match:${data.matchId}`);
    return { event: 'left', room: data.matchId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; senderId: string; content: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(
        data.matchId,
        data.senderId,
        data.content,
      );

      // Broadcast to the room
      this.server.to(`match:${data.matchId}`).emit('newMessage', message);
      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; userId: string; isTyping: boolean },
  ) {
    client.to(`match:${data.matchId}`).emit('userTyping', {
      userId: data.userId,
      isTyping: data.isTyping,
    });
  }
}
