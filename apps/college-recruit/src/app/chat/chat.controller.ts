import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class SendMessageDto {
  content: string;
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:matchId')
  async getMessages(
    @Request() req,
    @Param('matchId') matchId: string,
  ) {
    return this.chatService.getMessages(matchId);
  }

  @Post('messages/:matchId')
  async sendMessage(
    @Request() req,
    @Param('matchId') matchId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(matchId, req.user.userId, sendMessageDto.content);
  }
}
