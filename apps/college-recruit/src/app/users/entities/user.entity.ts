import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { PlayerProfile } from './player-profile.entity';
import { CoachProfile } from './coach-profile.entity';

export enum UserRole {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToOne(() => PlayerProfile, (profile) => profile.user)
  playerProfile: PlayerProfile;

  @OneToOne(() => CoachProfile, (profile) => profile.user)
  coachProfile: CoachProfile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
