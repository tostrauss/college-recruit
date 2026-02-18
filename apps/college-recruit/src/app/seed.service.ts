import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users/entities/user.entity';
import { PlayerProfile } from './users/entities/player-profile.entity';
import { CoachProfile } from './users/entities/coach-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PlayerProfile)
    private playerProfileRepository: Repository<PlayerProfile>,
    @InjectRepository(CoachProfile)
    private coachProfileRepository: Repository<CoachProfile>,
  ) {}

  async onModuleInit() {
    // Check if data already exists
    const userCount = await this.usersRepository.count();
    if (userCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    
    console.log('Seeding database with mock data...');
    await this.seed();
    console.log('Database seeded successfully!');
  }

  async seed() {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // Create Mock Players
    const mockPlayers = [
      {
        email: 'marcus@example.com',
        firstName: 'Marcus',
        lastName: 'Jenkins',
        sport: 'Football',
        positions: ['Quarterback'],
        graduationYear: 2025,
        heightCm: 191,
        weightKg: 97,
        gpa: '3.8',
        satScore: 1450,
        bio: 'Dual-threat QB with strong leadership skills. Captain of the varsity team for 2 years. Looking for a program that values decision-making and agility. 2023 State Finalist.',
        country: 'USA',
        city: 'Austin',
        videoUrl: 'https://youtube.com/watch?v=example1',
      },
      {
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Chen',
        sport: 'Volleyball',
        positions: ['Libero', 'Defensive Specialist'],
        graduationYear: 2024,
        heightCm: 168,
        weightKg: 59,
        gpa: '4.0',
        satScore: 1520,
        bio: 'Defensive specialist with high volleyball IQ. I pride myself on reading the hitter and relentless pursuit. Honor roll student interested in Pre-Med programs.',
        country: 'USA',
        city: 'San Diego',
      },
      {
        email: 'elijah@example.com',
        firstName: 'Elijah',
        lastName: 'Burke',
        sport: 'Basketball',
        positions: ['Point Guard'],
        graduationYear: 2025,
        heightCm: 185,
        weightKg: 84,
        gpa: '3.2',
        satScore: 1280,
        bio: 'Playmaker first. I focus on creating open shots for my teammates and locking down on defense. AAU circuit veteran looking for a D1 or high D2 opportunity.',
        country: 'USA',
        city: 'Chicago',
      },
      {
        email: 'mia@example.com',
        firstName: 'Mia',
        lastName: 'Rodriguez',
        sport: 'Soccer',
        positions: ['Center Midfield'],
        graduationYear: 2026,
        heightCm: 173,
        weightKg: 66,
        gpa: '3.9',
        satScore: 1480,
        bio: 'Box-to-box midfielder with excellent vision and distribution. ODP Regional Team member. I control the tempo of the game and create scoring chances.',
        country: 'USA',
        city: 'Miami',
      },
      {
        email: 'tyler@example.com',
        firstName: 'Tyler',
        lastName: 'Oakwood',
        sport: 'Baseball',
        positions: ['Pitcher', 'First Base'],
        graduationYear: 2025,
        heightCm: 193,
        weightKg: 93,
        gpa: '3.5',
        satScore: 1350,
        bio: 'Tall lefty with natural movement on the fastball and a sharp slider. Composed on the mound in high-pressure situations. Looking for a competitive baseball program.',
        country: 'USA',
        city: 'Marietta',
      },
      {
        email: 'amara@example.com',
        firstName: 'Amara',
        lastName: 'Diallo',
        sport: 'Track & Field',
        positions: ['Sprinter'],
        graduationYear: 2024,
        heightCm: 175,
        weightKg: 64,
        gpa: '3.7',
        satScore: 1420,
        bio: 'Explosive start and strong finisher. State champion in the 100m. Dedicated to training and looking to contribute immediately to a relay team at the next level.',
        country: 'USA',
        city: 'Seattle',
      },
    ];

    // Create Mock Coaches
    const mockCoaches = [
      {
        email: 'coach.miller@example.com',
        firstName: 'David',
        lastName: 'Miller',
        universityName: 'State University of Michigan',
        division: 'NCAA Division I',
        coachingRole: 'Head Football Coach',
        sportGender: "Men's",
        bio: '20 years of coaching experience with a focus on offensive strategy. Led the Wildcats to 3 conference titles in the last 5 years. Values discipline and academic integrity.',
      },
      {
        email: 'coach.vasquez@example.com',
        firstName: 'Elena',
        lastName: 'Vasquez',
        universityName: 'Pacific Coast College',
        division: 'NCAA Division II',
        coachingRole: 'Assistant Coach - Women\'s Soccer',
        sportGender: "Women's",
        bio: 'Former professional player specializing in player development and technical training. Focus is on recruiting athletes who can adapt to a possession-based style of play.',
      },
      {
        email: 'coach.thompson@example.com',
        firstName: 'Rick',
        lastName: 'Thompson',
        universityName: 'Southern Tech Institute',
        division: 'NCAA Division III',
        coachingRole: 'Head Baseball Coach',
        sportGender: "Men's",
        bio: 'Building a program based on analytics and development. We look for players with high ceilings who are willing to embrace data-driven training methods.',
      },
      {
        email: 'coach.bennett@example.com',
        firstName: 'Sarah',
        lastName: 'Bennett',
        universityName: 'North Valley University',
        division: 'NAIA',
        coachingRole: 'Director of Volleyball',
        sportGender: "Women's",
        bio: 'Focuses on building a family atmosphere within the team. We recruit high-character athletes who are resilient and supportive teammates.',
      },
      {
        email: 'coach.porter@example.com',
        firstName: 'James',
        lastName: 'Porter',
        universityName: 'Metropolitan University',
        division: 'NCAA Division I',
        coachingRole: 'Men\'s Basketball Head Coach',
        sportGender: "Men's",
        bio: 'Fast-paced offensive system requiring high stamina and quick decision making. We recruit athletes ready to play in a high-pressure city environment.',
      },
      {
        email: 'coach.wu@example.com',
        firstName: 'Linda',
        lastName: 'Wu',
        universityName: 'Eastern Liberal Arts College',
        division: 'NCAA Division III',
        coachingRole: 'Track & Field Head Coach',
        sportGender: "Co-ed",
        bio: 'Emphasizes the balance between rigorous academics and athletic excellence. Our program has produced 15 All-Americans in the last decade.',
      },
    ];

    // Create Players
    for (const playerData of mockPlayers) {
      const user = this.usersRepository.create({
        email: playerData.email,
        passwordHash: defaultPassword,
        role: UserRole.PLAYER,
        isVerified: true,
      });
      await this.usersRepository.save(user);

      const profile = this.playerProfileRepository.create({
        userId: user.id,
        ...playerData,
      });
      await this.playerProfileRepository.save(profile);
    }

    // Create Coaches
    for (const coachData of mockCoaches) {
      const user = this.usersRepository.create({
        email: coachData.email,
        passwordHash: defaultPassword,
        role: UserRole.COACH,
        isVerified: true,
      });
      await this.usersRepository.save(user);

      const profile = this.coachProfileRepository.create({
        userId: user.id,
        ...coachData,
      });
      await this.coachProfileRepository.save(profile);
    }
  }
}
