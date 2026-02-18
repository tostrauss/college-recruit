import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum Division {
  NCAA_D1 = 'NCAA_D1',
  NCAA_D2 = 'NCAA_D2',
  NCAA_D3 = 'NCAA_D3',
  NAIA = 'NAIA',
  NJCAA = 'NJCAA',
}

export enum CoachingRole {
  HEAD_COACH = 'HEAD_COACH',
  ASSISTANT_COACH = 'ASSISTANT_COACH',
  RECRUITER = 'RECRUITER',
}

export enum SportGender {
  MENS = 'MENS',
  WOMENS = 'WOMENS',
  COED = 'COED',
}

@Entity('coach_profiles')
export class CoachProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.coachProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  universityName: string;

  @Column({
    type: 'enum',
    enum: Division,
    nullable: true,
  })
  division: Division;

  @Column({
    type: 'enum',
    enum: CoachingRole,
    default: CoachingRole.HEAD_COACH,
  })
  coachingRole: CoachingRole;

  @Column({
    type: 'enum',
    enum: SportGender,
    default: SportGender.MENS,
  })
  sportGender: SportGender;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({ default: true })
  isProfileComplete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
