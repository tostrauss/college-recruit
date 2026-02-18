import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedService } from './seed.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchingModule } from './matching/matching.module';
import { ChatModule } from './chat/chat.module';

import { User } from './users/entities/user.entity';
import { PlayerProfile } from './users/entities/player-profile.entity';
import { CoachProfile } from './users/entities/coach-profile.entity';
import { Interaction } from './matching/entities/interaction.entity';
import { Match } from './matching/entities/match.entity';
import { Message } from './chat/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'college_recruit',
      entities: [User, PlayerProfile, CoachProfile, Interaction, Match, Message],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, PlayerProfile, CoachProfile]),
    UsersModule,
    AuthModule,
    MatchingModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
