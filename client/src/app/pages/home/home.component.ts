import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, FeedItem } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="logo">CollegeRecruit</div>
        <button (click)="logout()" style="background: none; border: none; cursor: pointer; padding: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        @if (loading()) {
          <div style="display: flex; align-items: center; justify-content: center; height: 60vh;">
            <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
        } @else if (feed().length === 0 || currentIndex() >= feed().length) {
          <div class="empty-state">
            <div class="empty-state-icon">🎉</div>
            <div class="empty-state-title">No more profiles</div>
            <div class="empty-state-text">Check back later for new matches</div>
          </div>
        } @else {
          <div class="swipe-card-container">
            <div 
              class="swipe-card"
              [class.swiping-left]="swipingDirection() === 'left'"
              [class.swiping-right]="swipingDirection() === 'right'"
            >
              <!-- Like/Nope Overlays -->
              <div class="swipe-overlay like">LIKE</div>
              <div class="swipe-overlay nope">NOPE</div>
              
              <!-- Profile Image -->
              <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center;">
                @if (currentProfile()?.profileImageUrl) {
                  <img [src]="currentProfile()!.profileImageUrl" style="width: 100%; height: 100%; object-fit: cover;" alt="Profile">
                } @else {
                  <span style="font-size: 100px;">{{ currentProfile()?.role === 'COACH' ? '🏆' : '🏃' }}</span>
                }
              </div>

              <!-- Profile Info Overlay -->
              <div class="swipe-card-overlay">
                <div class="swipe-card-name">
                  {{ currentProfile()?.firstName }} {{ currentProfile()?.lastName }}
                </div>
                @if (currentProfile()?.role === 'COACH') {
                  <div class="swipe-card-info">{{ currentProfile()?.universityName }}</div>
                  <div class="swipe-card-info" style="font-size: 14px;">{{ currentProfile()?.division }}</div>
                } @else {
                  <div class="swipe-card-info">{{ currentProfile()?.sport }}</div>
                  <div class="swipe-card-info" style="font-size: 14px;">Class of {{ currentProfile()?.graduationYear }}</div>
                }

                @if (currentProfile()?.positions?.length) {
                  <div class="swipe-card-tags" style="margin-top: 12px;">
                    @for (pos of currentProfile()?.positions; track pos) {
                      <span class="tag">{{ pos }}</span>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button 
                (click)="swipe('PASS')"
                class="action-btn pass"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button 
                (click)="swipe('SUPERLIKE')"
                class="action-btn superlike"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
              <button 
                (click)="swipe('LIKE')"
                class="action-btn like"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        }
      </main>

      <!-- Match Modal -->
      @if (showMatchModal()) {
        <div class="match-overlay" (click)="showMatchModal.set(false)">
          <div class="match-hearts">💕</div>
          <div class="match-text">It's a Match!</div>
          <p style="color: white; font-size: 16px; margin-bottom: 32px;">You and {{ matchedUserName() }} have liked each other!</p>
          <button 
            (click)="goToMatches()"
            class="btn btn-primary"
            style="min-width: 200px;"
          >
            Send Message
          </button>
          <button 
            (click)="showMatchModal.set(false)"
            style="background: transparent; border: none; color: white; margin-top: 16px; cursor: pointer; text-decoration: underline;"
          >
            Keep Swiping
          </button>
        </div>
      }

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <a class="bottom-nav-item active" (click)="activeTab.set('discover')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Discover</span>
        </a>
        <a class="bottom-nav-item" (click)="goToMatches()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Matches</span>
        </a>
        <a class="bottom-nav-item" (click)="goToProfile()">
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
export class HomeComponent implements OnInit {
  feed = signal<FeedItem[]>([]);
  currentIndex = signal(0);
  loading = signal(true);
  activeTab = signal<'discover' | 'matches'>('discover');
  swipingDirection = signal<'left' | 'right' | null>(null);
  showMatchModal = signal(false);
  matchedUserName = signal('');

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  get currentProfile(): () => FeedItem | undefined {
    return () => this.feed()[this.currentIndex()];
  }

  loadFeed(): void {
    this.loading.set(true);
    this.apiService.getFeed(20).subscribe({
      next: (data) => {
        this.feed.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  swipe(type: 'LIKE' | 'PASS' | 'SUPERLIKE'): void {
    const profile = this.currentProfile();
    if (!profile) return;

    this.swipingDirection.set(type === 'PASS' ? 'left' : 'right');

    this.apiService.swipe(profile.userId, type).subscribe({
      next: (response) => {
        if (response.matched) {
          this.matchedUserName.set(`${profile.firstName} ${profile.lastName}`);
          this.showMatchModal.set(true);
        }
        
        setTimeout(() => {
          this.swipingDirection.set(null);
          this.currentIndex.update(i => i + 1);
        }, 300);
      },
      error: () => {
        this.swipingDirection.set(null);
        this.currentIndex.update(i => i + 1);
      }
    });
  }

  goToMatches(): void {
    this.router.navigate(['/matches']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
  }
}
