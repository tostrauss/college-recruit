import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string, role: UserRole = UserRole.PLAYER): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      email,
      passwordHash,
      role,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'role', 'isVerified'],
    });
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['playerProfile', 'coachProfile'],
    });
  }

  async updateVerificationStatus(userId: string, isVerified: boolean): Promise<void> {
    await this.usersRepository.update(userId, { isVerified });
  }

  async updateProfileImage(userId: string, imageUrl: string): Promise<void> {
    await this.usersRepository.update(userId, { profileImageUrl: imageUrl });
  }
}
