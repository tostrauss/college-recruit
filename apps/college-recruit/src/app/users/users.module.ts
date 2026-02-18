import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PlayerProfilesService } from './player-profiles.service';
import { CoachProfilesService } from './coach-profiles.service';
import { User } from './entities/user.entity';
import { PlayerProfile } from './entities/player-profile.entity';
import { CoachProfile } from './entities/coach-profile.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PlayerProfile, CoachProfile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, PlayerProfilesService, CoachProfilesService],
  exports: [UsersService, PlayerProfilesService, CoachProfilesService],
})
export class UsersModule {}
