import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { MatchingService, FeedItem } from './matching.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InteractionType } from './entities/interaction.entity';

class SwipeDto {
  targetId: string;
  type: InteractionType;
}

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  @Get('feed')
  async getFeed(
    @Request() req,
    @Query('limit') limit?: number,
  ): Promise<FeedItem[]> {
    return this.matchingService.getFeed(req.user.userId, req.user.role, limit || 20);
  }

  @Post('swipe')
  async swipe(
    @Request() req,
    @Body() swipeDto: SwipeDto,
  ) {
    return this.matchingService.swipe(req.user.userId, swipeDto.targetId, swipeDto.type);
  }

  @Get('matches')
  async getMatches(@Request() req) {
    return this.matchingService.getMatches(req.user.userId);
  }
}
