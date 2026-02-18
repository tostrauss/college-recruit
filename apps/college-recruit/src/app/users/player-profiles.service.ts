import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerProfile } from './entities/player-profile.entity';

@Injectable()
export class PlayerProfilesService {
  constructor(
    @InjectRepository(PlayerProfile)
    private playerProfileRepository: Repository<PlayerProfile>,
  ) {}

  async create(userId: string): Promise<PlayerProfile> {
    const profile = this.playerProfileRepository.create({ userId });
    return this.playerProfileRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<PlayerProfile | undefined> {
    return this.playerProfileRepository.findOne({ where: { userId } });
  }

  async update(userId: string, data: Partial<PlayerProfile>): Promise<PlayerProfile> {
    await this.playerProfileRepository.update({ userId }, data);
    return this.findByUserId(userId);
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<PlayerProfile[]> {
    return this.playerProfileRepository.find({
      where: { isProfileComplete: true },
      relations: ['user'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }
}
