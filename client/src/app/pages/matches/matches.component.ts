import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Match, Message, FeedItem } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <button (click)="goBack()" style="background: none; border: none; cursor: pointer; padding: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="logo">Messages</div>
        <div style="width: 40px;"></div>
      </header>

      <main class="main-content" style="padding-bottom: 80px;">
        @if (loading()) {
          <div style="display: flex; align-items: center; justify-content: center; height: 50vh;">
            <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
        } @else if (matches().length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon">💌</div>
            <div class="empty-state-title">No matches yet</div>
            <div class="empty-state-text">Start swiping to find your match!</div>
            <button (click)="goHome()" class="btn btn-primary">Discover</button>
          </div>
        } @else {
          @if (activeMatch()) {
            <!-- Chat View -->
            <div class="chat-container" style="height: calc(100vh - 150px); background: white; margin: 16px; border-radius: 20px; overflow: hidden;">
              <!-- Chat Header -->
              <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 12px;">
                <button (click)="activeMatch.set(null)" style="background: none; border: none; cursor: pointer; padding: 4px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                  {{ activeMatchUser()?.firstName?.charAt(0) || '?' }}
                </div>
                <div>
                  <h3 style="font-weight: 600; font-size: 16px;">{{ activeMatchUser()?.firstName }} {{ activeMatchUser()?.lastName }}</h3>
                  <p style="font-size: 12px; color: #6b7280;">{{ activeMatchUser()?.universityName || activeMatchUser()?.sport }}</p>
                </div>
              </div>

              <!-- Messages -->
              <div class="messages-list">
                @for (message of messages(); track message.id) {
                  <div 
                    class="message-bubble"
                    [class.sent]="message.senderId === currentUserId"
                    [class.received]="message.senderId !== currentUserId"
                  >
                    {{ message.content }}
                  </div>
                }
              </div>

              <!-- Input -->
              <div class="message-input-container">
                <input 
                  type="text"
                  [(ngModel)]="newMessage"
                  (keyup.enter)="sendMessage()"
                  placeholder="Type a message..."
                  class="message-input"
                >
                <button 
                  (click)="sendMessage()"
                  style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          } @else {
            <!-- Match List -->
            <div class="matches-list">
              @for (match of matches(); track match.id) {
                <button 
                  (click)="selectMatch(match)"
                  class="match-item"
                >
                  <div class="match-avatar">
                    {{ getMatchUser(match)?.firstName?.charAt(0) || '?' }}
                  </div>
                  <div class="match-info">
                    <div class="match-name">{{ getMatchUser(match)?.firstName }} {{ getMatchUser(match)?.lastName }}</div>
                    <div class="match-preview">{{ getMatchUser(match)?.universityName || getMatchUser(match)?.sport }}</div>
                  </div>
                  <span style="font-size: 11px; color: #9ca3af;">
                    {{ formatDate(match.matchedAt) }}
                  </span>
                </button>
              }
            </div>
          }
        }
      </main>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a class="bottom-nav-item" (click)="goHome()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Discover</span>
        </a>
        <a class="bottom-nav-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Matches</span>
        </a>
        <a class="bottom-nav-item" (click)="goProfile()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </a>
      </nav>

      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </div>
  `
})
export class MatchesComponent implements OnInit {
  matches = signal<Match[]>([]);
  messages = signal<Message[]>([]);
  loading = signal(true);
  activeMatch = signal<Match | null>(null);
  activeMatchUser = signal<FeedItem | null>(null);
  newMessage = '';
  socket: Socket | null = null;
  currentUserId = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserId = user.id;
    }
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading.set(true);
    this.apiService.getMatches().subscribe({
      next: (data) => {
        this.matches.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getMatchUser(match: Match): FeedItem | undefined {
    // Mock data mapping for demo
    const mockUsers: { [key: string]: FeedItem } = {
      'player-1': { id: 'p1', userId: 'player-1', role: 'PLAYER', firstName: 'Marcus', lastName: 'Jenkins', sport: 'Football' },
      'player-2': { id: 'p2', userId: 'player-2', role: 'PLAYER', firstName: 'Sarah', lastName: 'Chen', sport: 'Volleyball' },
      'coach-1': { id: 'c1', userId: 'coach-1', role: 'COACH', firstName: 'David', lastName: 'Miller', universityName: 'State University of Michigan' },
      'coach-2': { id: 'c2', userId: 'coach-2', role: 'COACH', firstName: 'Elena', lastName: 'Vasquez', universityName: 'Pacific Coast College' },
    };
    
    // Try to find by playerId or coachId
    return mockUsers[match.playerId] || mockUsers[match.coachId] || {
      id: '',
      userId: match.playerId,
      role: 'PLAYER',
      firstName: 'Player',
      lastName: ''
    };
  }

  selectMatch(match: Match): void {
    this.activeMatch.set(match);
    this.loadMessages(match.id);
    this.connectSocket(match.id);
  }

  loadMessages(matchId: string): void {
    this.apiService.getMessages(matchId).subscribe({
      next: (data) => {
        this.messages.set(data);
      }
    });
  }

  connectSocket(matchId: string): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });

    this.socket.emit('joinRoom', { matchId });

    this.socket.on('newMessage', (message: Message) => {
      this.messages.update(msgs => [...msgs, message]);
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.activeMatch()) return;

    const matchId = this.activeMatch()!.id;
    
    if (this.socket) {
      this.socket.emit('sendMessage', {
        matchId,
        senderId: this.currentUserId,
        content: this.newMessage
      });
    }

    this.newMessage = '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goProfile(): void {
    this.router.navigate(['/profile']);
  }

  goBack(): void {
    if (this.activeMatch()) {
      this.activeMatch.set(null);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
