import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from '../../matching/entities/match.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @ManyToOne(() => Match, (match) => match.messages)
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column()
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
