import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum Sport {
  SOCCER = 'SOCCER',
  BASKETBALL = 'BASKETBALL',
  FOOTBALL = 'FOOTBALL',
  BASEBALL = 'BASEBALL',
  VOLLEYBALL = 'VOLLEYBALL',
  TENNIS = 'TENNIS',
  SWIMMING = 'SWIMMING',
  TRACK = 'TRACK',
  OTHER = 'OTHER',
}

export enum Position {
  // Soccer
  GK = 'GK',
  LB = 'LB',
  CB = 'CB',
  RB = 'RB',
  CDM = 'CDM',
  CM = 'CM',
  CAM = 'CAM',
  LW = 'LW',
  RW = 'RW',
  ST = 'ST',
  // Basketball
  PG = 'PG',
  SG = 'SG',
  SF = 'SF',
  PF = 'PF',
  C = 'C',
  // General
  VER = 'VER',
}

export enum StrongFoot {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BOTH = 'BOTH',
}

@Entity('player_profiles')
export class PlayerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.playerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  heightCm: number;

  @Column({ nullable: true })
  weightKg: number;

  @Column({ nullable: true })
  gpa: string;

  @Column({ nullable: true })
  satScore: number;

  @Column({
    type: 'enum',
    enum: Sport,
    default: Sport.SOCCER,
  })
  sport: Sport;

  @Column('text', { array: true, default: [] })
  positions: Position[];

  @Column({
    type: 'enum',
    enum: StrongFoot,
    default: StrongFoot.RIGHT,
  })
  strongFoot: StrongFoot;

  @Column({ nullable: true })
  graduationYear: number;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: true })
  isProfileComplete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
