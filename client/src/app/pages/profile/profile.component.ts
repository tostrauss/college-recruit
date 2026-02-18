import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, PlayerProfile, CoachProfile } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="logo">Profile</div>
        <button (click)="logout()" style="background: none; border: none; cursor: pointer; padding: 8px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </header>

      <main class="main-content">
        @if (loading()) {
          <div style="display: flex; align-items: center; justify-content: center; height: 50vh;">
            <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>
        } @else {
          <div class="profile-container">
            <!-- Profile Header -->
            <div class="profile-header">
              <div class="profile-avatar-large">
                {{ user()?.role === 'PLAYER' ? '🏃' : '🏆' }}
              </div>
              <div class="profile-name">{{ user()?.email }}</div>
              <div class="profile-role">{{ user()?.role === 'PLAYER' ? 'Student Athlete' : 'College Coach' }}</div>
            </div>

            @if (user()?.role === 'PLAYER') {
              <div class="profile-section">
                <div class="profile-section-title">Personal Information</div>
                <div class="profile-field">
                  <div class="profile-field-label">First Name</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.firstName" 
                    class="form-input"
                    placeholder="Enter first name"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Last Name</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.lastName" 
                    class="form-input"
                    placeholder="Enter last name"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Sport</div>
                  <select [(ngModel)]="playerProfile.sport" class="form-input">
                    <option value="">Select sport</option>
                    <option value="SOCCER">Soccer</option>
                    <option value="BASKETBALL">Basketball</option>
                    <option value="BASEBALL">Baseball</option>
                    <option value="FOOTBALL">Football</option>
                    <option value="TENNIS">Tennis</option>
                    <option value="SWIMMING">Swimming</option>
                    <option value="TRACK">Track & Field</option>
                    <option value="VOLLEYBALL">Volleyball</option>
                  </select>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Position</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.positions" 
                    class="form-input"
                    placeholder="e.g., Forward, Midfielder"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Graduation Year</div>
                  <input 
                    type="number" 
                    [(ngModel)]="playerProfile.graduationYear" 
                    class="form-input"
                    placeholder="e.g., 2027"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">GPA</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.gpa" 
                    class="form-input"
                    placeholder="e.g., 3.5"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">SAT Score</div>
                  <input 
                    type="number" 
                    [(ngModel)]="playerProfile.satScore" 
                    class="form-input"
                    placeholder="e.g., 1400"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Height (cm)</div>
                  <input 
                    type="number" 
                    [(ngModel)]="playerProfile.heightCm" 
                    class="form-input"
                    placeholder="e.g., 180"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Weight (kg)</div>
                  <input 
                    type="number" 
                    [(ngModel)]="playerProfile.weightKg" 
                    class="form-input"
                    placeholder="e.g., 75"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Country</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.country" 
                    class="form-input"
                    placeholder="e.g., Brazil"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">City</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.city" 
                    class="form-input"
                    placeholder="e.g., São Paulo"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Bio</div>
                  <textarea 
                    [(ngModel)]="playerProfile.bio" 
                    rows="4" 
                    class="form-input"
                    placeholder="Tell coaches about yourself..."
                  ></textarea>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Video URL</div>
                  <input 
                    type="text" 
                    [(ngModel)]="playerProfile.videoUrl" 
                    class="form-input"
                    placeholder="YouTube or highlight video link"
                  >
                </div>
              </div>
            } @else {
              <div class="profile-section">
                <div class="profile-section-title">Coach Information</div>
                <div class="profile-field">
                  <div class="profile-field-label">First Name</div>
                  <input 
                    type="text" 
                    [(ngModel)]="coachProfile.firstName" 
                    class="form-input"
                    placeholder="Enter first name"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Last Name</div>
                  <input 
                    type="text" 
                    [(ngModel)]="coachProfile.lastName" 
                    class="form-input"
                    placeholder="Enter last name"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">University Name</div>
                  <input 
                    type="text" 
                    [(ngModel)]="coachProfile.universityName" 
                    class="form-input"
                    placeholder="e.g., UCLA"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Division</div>
                  <select [(ngModel)]="coachProfile.division" class="form-input">
                    <option value="">Select division</option>
                    <option value="NCAA_D1">NCAA Division I</option>
                    <option value="NCAA_D2">NCAA Division II</option>
                    <option value="NCAA_D3">NCAA Division III</option>
                    <option value="NAIA">NAIA</option>
                    <option value="NJCAA">NJCAA</option>
                  </select>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Coaching Role</div>
                  <input 
type="text" 
                    [(ngModel)]="coachProfile.coachingRole" 
                    class="form-input"
                    placeholder="e.g., Head Coach, Assistant Coach"
                  >
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Sport Gender</div>
                  <select [(ngModel)]="coachProfile.sportGender" class="form-input">
                    <option value="">Select</option>
                    <option value="MENS">Men's</option>
                    <option value="WOMENS">Women's</option>
                    <option value="COED">Co-ed</option>
                  </select>
                </div>
                <div class="profile-field">
                  <div class="profile-field-label">Bio</div>
                  <textarea 
                    [(ngModel)]="coachProfile.bio" 
                    rows="4" 
                    class="form-input"
                    placeholder="Tell players about your program..."
                  ></textarea>
                </div>
              </div>
            }

            <button (click)="saveProfile()" [disabled]="saving()" class="btn btn-primary btn-block" style="margin-top: 16px;">
              {{ saving() ? 'Saving...' : 'Save Profile' }}
            </button>

            @if (saveSuccess()) {
              <div style="margin-top: 16px; background: #dcfce7; color: #16a34a; padding: 12px 16px; border-radius: 12px; text-align: center;">
                Profile saved successfully!
              </div>
            }
          </div>
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
        <a class="bottom-nav-item" (click)="goMatches()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Matches</span>
        </a>
        <a class="bottom-nav-item active">
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
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  user = this.authService.currentUser;
  loading = signal(true);
  saving = signal(false);
  saveSuccess = signal(false);
  playerProfile: Partial<PlayerProfile> = {};
  coachProfile: Partial<CoachProfile> = {};

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const role = this.user()?.role;
    if (role === 'PLAYER') {
      this.apiService.getPlayerProfile().subscribe({
        next: (data: PlayerProfile) => { this.playerProfile = data || {}; this.loading.set(false); },
        error: () => { this.loading.set(false); }
      });
    } else {
      this.apiService.getCoachProfile().subscribe({
        next: (data: CoachProfile) => { this.coachProfile = data || {}; this.loading.set(false); },
        error: () => { this.loading.set(false); }
      });
    }
  }

  saveProfile(): void {
    this.saving.set(true);
    this.saveSuccess.set(false);
    const role = this.user()?.role;

    if (role === 'PLAYER') {
      this.apiService.updatePlayerProfile(this.playerProfile).subscribe({
        next: () => { this.saving.set(false); this.saveSuccess.set(true); setTimeout(() => this.saveSuccess.set(false), 3000); },
        error: () => { this.saving.set(false); }
      });
    } else {
      this.apiService.updateCoachProfile(this.coachProfile).subscribe({
        next: () => { this.saving.set(false); this.saveSuccess.set(true); setTimeout(() => this.saveSuccess.set(false), 3000); },
        error: () => { this.saving.set(false); }
      });
    }
  }

  goHome(): void { this.router.navigate(['/home']); }
  goMatches(): void { this.router.navigate(['/matches']); }
  logout(): void { this.authService.logout(); }
}
