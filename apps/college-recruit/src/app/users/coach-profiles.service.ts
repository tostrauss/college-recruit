import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoachProfile } from './entities/coach-profile.entity';

@Injectable()
export class CoachProfilesService {
  constructor(
    @InjectRepository(CoachProfile)
    private coachProfileRepository: Repository<CoachProfile>,
  ) {}

  async create(userId: string): Promise<CoachProfile> {
    const profile = this.coachProfileRepository.create({ userId });
    return this.coachProfileRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<CoachProfile | undefined> {
    return this.coachProfileRepository.findOne({ where: { userId } });
  }

  async update(userId: string, data: Partial<CoachProfile>): Promise<CoachProfile> {
    await this.coachProfileRepository.update({ userId }, data);
    return this.findByUserId(userId);
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<CoachProfile[]> {
    return this.coachProfileRepository.find({
      where: { isProfileComplete: true },
      relations: ['user'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }
}
