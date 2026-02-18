import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface PlayerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
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

export interface CoachProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  universityName?: string;
  division?: string;
  coachingRole?: string;
  sportGender?: string;
  profileImageUrl?: string;
  bio?: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  role: 'PLAYER' | 'COACH';
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  sport?: string;
  positions?: string[];
  graduationYear?: number;
  universityName?: string;
  division?: string;
  bio?: string;
}

export interface Match {
  id: string;
  playerId: string;
  coachId: string;
  isActive: boolean;
  matchedAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

// Mock Data for Demo
const MOCK_PLAYERS: FeedItem[] = [
  {
    id: 'p1',
    userId: 'player-1',
    role: 'PLAYER',
    firstName: 'Marcus',
    lastName: 'Jenkins',
    sport: 'Football',
    positions: ['Quarterback'],
    graduationYear: 2025,
    bio: 'Dual-threat QB with strong leadership skills. Captain of the varsity team for 2 years. Looking for a program that values decision-making and agility.',
  },
  {
    id: 'p2',
    userId: 'player-2',
    role: 'PLAYER',
    firstName: 'Sarah',
    lastName: 'Chen',
    sport: 'Volleyball',
    positions: ['Libero', 'Defensive Specialist'],
    graduationYear: 2024,
    bio: 'Defensive specialist with high volleyball IQ. Honor roll student interested in Pre-Med programs.',
  },
  {
    id: 'p3',
    userId: 'player-3',
    role: 'PLAYER',
    firstName: 'Elijah',
    lastName: 'Burke',
    sport: 'Basketball',
    positions: ['Point Guard'],
    graduationYear: 2025,
    bio: 'Playmaker first. AAU circuit veteran looking for a D1 or high D2 opportunity.',
  },
  {
    id: 'p4',
    userId: 'player-4',
    role: 'PLAYER',
    firstName: 'Mia',
    lastName: 'Rodriguez',
    sport: 'Soccer',
    positions: ['Center Midfield'],
    graduationYear: 2026,
    bio: 'Box-to-box midfielder with excellent vision and distribution. ODP Regional Team member.',
  },
  {
    id: 'p5',
    userId: 'player-5',
    role: 'PLAYER',
    firstName: 'Tyler',
    lastName: 'Oakwood',
    sport: 'Baseball',
    positions: ['Pitcher'],
    graduationYear: 2025,
    bio: 'Tall lefty with natural movement on a sharp slider.',
  },
  {
    id: 'p6',
    userId: 'player-6',
    role: 'PLAYER',
    firstName: 'Amara',
    lastName: 'Diallo',
    sport: 'Track & Field',
    positions: ['Sprinter'],
    graduationYear: 2024,
    bio: 'Explosive start and strong finisher. State champion in the 100m.',
  },
];

const MOCK_COACHES: FeedItem[] = [
  {
    id: 'c1',
    userId: 'coach-1',
    role: 'COACH',
    firstName: 'David',
    lastName: 'Miller',
    universityName: 'State University of Michigan',
    division: 'NCAA Division I',
    bio: '20 years of coaching experience with a focus on offensive strategy. Led the Wildcats to 3 conference titles.',
  },
  {
    id: 'c2',
    userId: 'coach-2',
    role: 'COACH',
    firstName: 'Elena',
    lastName: 'Vasquez',
    universityName: 'Pacific Coast College',
    division: 'NCAA Division II',
    bio: 'Former professional player specializing in player development and technical training.',
  },
  {
    id: 'c3',
    userId: 'coach-3',
    role: 'COACH',
    firstName: 'Rick',
    lastName: 'Thompson',
    universityName: 'Southern Tech Institute',
    division: 'NCAA Division III',
    bio: 'Building a program based on analytics and development.',
  },
  {
    id: 'c4',
    userId: 'coach-4',
    role: 'COACH',
    firstName: 'Sarah',
    lastName: 'Bennett',
    universityName: 'North Valley University',
    division: 'NAIA',
    bio: 'Focuses on building a family atmosphere within the team.',
  },
  {
    id: 'c5',
    userId: 'coach-5',
    role: 'COACH',
    firstName: 'James',
    lastName: 'Porter',
    universityName: 'Metropolitan University',
    division: 'NCAA Division I',
    bio: 'Fast-paced offensive system requiring high stamina and quick decision making.',
  },
  {
    id: 'c6',
    userId: 'coach-6',
    role: 'COACH',
    firstName: 'Linda',
    lastName: 'Wu',
    universityName: 'Eastern Liberal Arts College',
    division: 'NCAA Division III',
    bio: 'Emphasizes the balance between rigorous academics and athletic excellence.',
  },
];

const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    playerId: 'player-1',
    coachId: 'coach-1',
    isActive: true,
    matchedAt: new Date('2026-02-15'),
  },
  {
    id: 'm2',
    playerId: 'player-2',
    coachId: 'coach-2',
    isActive: true,
    matchedAt: new Date('2026-02-16'),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg1',
    matchId: 'm1',
    senderId: 'coach-1',
    content: 'Hi Marcus! I saw your highlight tape - impressive throws!',
    createdAt: new Date('2026-02-15T10:30:00'),
  },
  {
    id: 'msg2',
    matchId: 'm1',
    senderId: 'player-1',
    content: 'Thank you Coach Miller! I would love to learn more about your program.',
    createdAt: new Date('2026-02-15T11:00:00'),
  },
  {
    id: 'msg3',
    matchId: 'm1',
    senderId: 'coach-1',
    content: 'Great! Let\'s schedule a call this week. What days work for you?',
    createdAt: new Date('2026-02-15T11:30:00'),
  },
];

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';
  private useMockData = true; // Set to false when backend is available

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // User endpoints
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/users/me`, { headers: this.getHeaders() });
  }

  // Player profile
  getPlayerProfile(): Observable<PlayerProfile> {
    if (this.useMockData) {
      return of({
        id: 'p1',
        userId: 'current-user',
        firstName: 'Marcus',
        lastName: 'Jenkins',
        sport: 'Football',
        positions: ['Quarterback'],
        graduationYear: 2025,
        heightCm: 191,
        weightKg: 97,
        gpa: '3.8',
        satScore: 1450,
        bio: 'Dual-threat QB with strong leadership skills.',
        country: 'USA',
        city: 'Austin',
      });
    }
    return this.http.get<PlayerProfile>(`${this.API_URL}/users/profile/player`, { headers: this.getHeaders() });
  }

  updatePlayerProfile(data: Partial<PlayerProfile>): Observable<PlayerProfile> {
    return this.http.put<PlayerProfile>(`${this.API_URL}/users/profile/player`, data, { headers: this.getHeaders() });
  }

  // Coach profile
  getCoachProfile(): Observable<CoachProfile> {
    if (this.useMockData) {
      return of({
        id: 'c1',
        userId: 'current-user',
        firstName: 'David',
        lastName: 'Miller',
        universityName: 'State University of Michigan',
        division: 'NCAA Division I',
        coachingRole: 'Head Football Coach',
        sportGender: "Men's",
        bio: '20 years of coaching experience.',
      });
    }
    return this.http.get<CoachProfile>(`${this.API_URL}/users/profile/coach`, { headers: this.getHeaders() });
  }

  updateCoachProfile(data: Partial<CoachProfile>): Observable<CoachProfile> {
    return this.http.put<CoachProfile>(`${this.API_URL}/users/profile/coach`, data, { headers: this.getHeaders() });
  }

  // Matching
  getFeed(limit: number = 20): Observable<FeedItem[]> {
    if (this.useMockData) {
      // Return coaches for players, players for coaches
      const user = this.authService.currentUser();
      const isPlayer = user?.role === 'PLAYER';
      return of(isPlayer ? MOCK_COACHES : MOCK_PLAYERS);
    }
    return this.http.get<FeedItem[]>(`${this.API_URL}/matching/feed?limit=${limit}`, { headers: this.getHeaders() });
  }

  swipe(targetId: string, type: 'LIKE' | 'PASS' | 'SUPERLIKE'): Observable<{ matched: boolean; matchId?: string }> {
    if (this.useMockData) {
      // Simulate a match 50% of the time for demo
      const matched = type === 'LIKE' && Math.random() > 0.5;
      return of({
        matched,
        matchId: matched ? 'm' + Date.now() : undefined
      });
    }
    return this.http.post<{ matched: boolean; matchId?: string }>(
      `${this.API_URL}/matching/swipe`,
      { targetId, type },
      { headers: this.getHeaders() }
    );
  }

  getMatches(): Observable<Match[]> {
    if (this.useMockData) {
      return of(MOCK_MATCHES);
    }
    return this.http.get<Match[]>(`${this.API_URL}/matching/matches`, { headers: this.getHeaders() });
  }

  // Chat
  getMessages(matchId: string): Observable<Message[]> {
    if (this.useMockData) {
      return of(MOCK_MESSAGES.filter(m => m.matchId === matchId));
    }
    return this.http.get<Message[]>(`${this.API_URL}/chat/messages/${matchId}`, { headers: this.getHeaders() });
  }

  sendMessage(matchId: string, content: string): Observable<Message> {
    if (this.useMockData) {
      const newMessage: Message = {
        id: 'msg' + Date.now(),
        matchId,
        senderId: 'current-user',
        content,
        createdAt: new Date()
      };
      return of(newMessage);
    }
    return this.http.post<Message>(
      `${this.API_URL}/chat/messages/${matchId}`,
      { content },
      { headers: this.getHeaders() }
    );
  }
}
