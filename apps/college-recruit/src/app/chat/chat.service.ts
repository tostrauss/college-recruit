import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Match } from '../matching/entities/match.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async getMessages(matchId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { matchId },
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(matchId: string, senderId: string, content: string): Promise<Message> {
    // Verify match exists and is active
    const match = await this.matchRepository.findOne({
      where: { id: matchId, isActive: true },
    });

    if (!match) {
      throw new Error('Match not found or inactive');
    }

    // Verify sender is part of the match
    if (match.playerId !== senderId && match.coachId !== senderId) {
      throw new Error('Not authorized to send message in this match');
    }

    const message = this.messageRepository.create({
      matchId,
      senderId,
      content,
    });
    return this.messageRepository.save(message);
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['match'],
    });

    if (message && message.match) {
      const match = message.match;
      // Only mark as read if user is not the sender
      if (message.senderId !== userId) {
        await this.messageRepository.update(messageId, { readAt: new Date() });
      }
    }
  }
}
