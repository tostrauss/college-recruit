import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Message } from '../../chat/entities/message.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  playerId: string;

  @Column()
  coachId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Message, (message) => message.match)
  messages: Message[];

  @CreateDateColumn()
  matchedAt: Date;
}
