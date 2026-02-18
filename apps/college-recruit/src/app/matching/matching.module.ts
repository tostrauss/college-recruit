import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { Interaction } from './entities/interaction.entity';
import { Match } from './entities/match.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interaction, Match]),
    forwardRef(() => UsersModule),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
