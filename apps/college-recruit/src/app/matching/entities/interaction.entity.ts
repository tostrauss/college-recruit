import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

export enum InteractionType {
  LIKE = 'LIKE',
  PASS = 'PASS',
  SUPERLIKE = 'SUPERLIKE',
}

@Entity('interactions')
@Unique(['actorId', 'targetId'])
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column()
  targetId: string;

  @Column({
    type: 'enum',
    enum: InteractionType,
  })
  type: InteractionType;

  @CreateDateColumn()
  createdAt: Date;
}
