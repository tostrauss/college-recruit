import { Controller, Get, Post, Body, UseGuards, Request, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { PlayerProfilesService } from './player-profiles.service';
import { CoachProfilesService } from './coach-profiles.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

class RegisterDto {
  email: string;
  password: string;
  role: UserRole;
}

class UpdatePlayerProfileDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  heightCm?: number;
  weightKg?: number;
  gpa?: string;
  satScore?: number;
  sport?: string;
  positions?: string[];
  strongFoot?: string;
  graduationYear?: number;
  videoUrl?: string;
  profileImageUrl?: string;
  bio?: string;
  country?: string;
  city?: string;
}

class UpdateCoachProfileDto {
  firstName?: string;
  lastName?: string;
  universityName?: string;
  division?: string;
  coachingRole?: string;
  sportGender?: string;
  profileImageUrl?: string;
  bio?: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private playerProfilesService: PlayerProfilesService,
    private coachProfilesService: CoachProfilesService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.role,
    );

    // Create empty profile based on role
    if (registerDto.role === UserRole.PLAYER) {
      await this.playerProfilesService.create(user.id);
    } else if (registerDto.role === UserRole.COACH) {
      await this.coachProfilesService.create(user.id);
    }

    const token = await this.authService.login(user);
    return { user, ...token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const user = await this.usersService.findByIdWithRelations(req.user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/player')
  async getPlayerProfile(@Request() req) {
    return this.playerProfilesService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/player')
  async updatePlayerProfile(
    @Request() req,
    @Body() updateDto: any,
  ) {
    return this.playerProfilesService.update(req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/coach')
  async getCoachProfile(@Request() req) {
    return this.coachProfilesService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/coach')
  async updateCoachProfile(
    @Request() req,
    @Body() updateDto: any,
  ) {
    return this.coachProfilesService.update(req.user.userId, updateDto);
  }
}
