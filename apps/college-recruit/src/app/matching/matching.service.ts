import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction, InteractionType } from './entities/interaction.entity';
import { Match } from './entities/match.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { PlayerProfilesService } from '../users/player-profiles.service';
import { CoachProfilesService } from '../users/coach-profiles.service';

export interface FeedItem {
  id: string;
  userId: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  sport?: string;
  positions?: string[];
  graduationYear?: number;
  universityName?: string;
  division?: string;
  bio?: string;
}

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private playerProfilesService: PlayerProfilesService,
    private coachProfilesService: CoachProfilesService,
  ) {}

  async getFeed(userId: string, userRole: UserRole, limit: number = 20): Promise<FeedItem[]> {
    // Get all users this user has already interacted with
    const interactions = await this.interactionRepository.find({
      where: { actorId: userId },
      select: ['targetId'],
    });
    const interactedUserIds = interactions.map((i) => i.targetId);
    interactedUserIds.push(userId); // Exclude self

    // Players see coaches, Coaches see players
    const targetRole = userRole === UserRole.PLAYER ? UserRole.COACH : UserRole.PLAYER;

    if (targetRole === UserRole.COACH) {
      // Get players for coaches to see
      const players = await this.playerProfilesService.findAll(100, 0);
      return players
        .filter((p) => !interactedUserIds.includes(p.userId))
        .slice(0, limit)
        .map((p) => ({
          id: p.id,
          userId: p.userId,
          role: UserRole.PLAYER,
          firstName: p.firstName,
          lastName: p.lastName,
          profileImageUrl: p.profileImageUrl,
          sport: p.sport,
          positions: p.positions,
          graduationYear: p.graduationYear,
          bio: p.bio,
        }));
    } else {
      // Get coaches for players to see
      const coaches = await this.coachProfilesService.findAll(100, 0);
      return coaches
        .filter((c) => !interactedUserIds.includes(c.userId))
        .slice(0, limit)
        .map((c) => ({
          id: c.id,
          userId: c.userId,
          role: UserRole.COACH,
          firstName: c.firstName,
          lastName: c.lastName,
          profileImageUrl: c.profileImageUrl,
          universityName: c.universityName,
          division: c.division,
          bio: c.bio,
        }));
    }
  }

  async swipe(actorId: string, targetId: string, type: InteractionType): Promise<{ matched: boolean; matchId?: string }> {
    // Save the interaction
    const interaction = this.interactionRepository.create({
      actorId,
      targetId,
      type,
    });
    await this.interactionRepository.save(interaction);

    // Check for match if it's a like
    if (type === InteractionType.LIKE || type === InteractionType.SUPERLIKE) {
      // Check if target has already liked actor
      const existingLike = await this.interactionRepository.findOne({
        where: {
          actorId: targetId,
          targetId: actorId,
          type: InteractionType.LIKE,
        },
      });

      if (existingLike) {
        // Create match
        const match = this.matchRepository.create({
          playerId: actorId,
          coachId: targetId,
        });
        const savedMatch = await this.matchRepository.save(match);
        return { matched: true, matchId: savedMatch.id };
      }
    }

    return { matched: false };
  }

  async getMatches(userId: string): Promise<Match[]> {
    return this.matchRepository.find({
      where: [
        { playerId: userId, isActive: true },
        { coachId: userId, isActive: true },
      ],
      relations: ['messages'],
      order: { matchedAt: 'DESC' },
    });
  }
}
