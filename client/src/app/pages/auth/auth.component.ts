import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <h1>CollegeRecruit</h1>
          <p>Find your perfect college match</p>
        </div>

        <!-- Toggle -->
        <div class="role-selector" style="margin-bottom: 24px; background: #f3f4f6; padding: 4px; border-radius: 12px;">
          <button 
            (click)="isLogin.set(true)"
            [class.selected]="isLogin()"
            style="flex: 1; padding: 12px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.2s;"
            [style.background]="isLogin() ? 'white' : 'transparent'"
            [style.color]="isLogin() ? '#6366f1' : '#6b7280'"
          >
            Sign In
          </button>
          <button 
            (click)="isLogin.set(false)"
            [class.selected]="!isLogin()"
            style="flex: 1; padding: 12px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.2s;"
            [style.background]="!isLogin() ? 'white' : 'transparent'"
            [style.color]="!isLogin() ? '#6366f1' : '#6b7280'"
          >
            Register
          </button>
        </div>

        @if (error()) {
          <div style="background: #fef2f2; color: #dc2626; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px; font-size: 14px;">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()">
          @if (!isLogin()) {
            <div class="form-group">
              <label class="form-label">I am a</label>
              <div class="role-selector">
                <div 
                  (click)="role.set('PLAYER')"
                  [class.selected]="role() === 'PLAYER'"
                  class="role-option"
                >
                  <div class="role-option-icon">🏃</div>
                  <div class="role-option-label">Player</div>
                </div>
                <div 
                  (click)="role.set('COACH')"
                  [class.selected]="role() === 'COACH'"
                  class="role-option"
                >
                  <div class="role-option-icon">🏆</div>
                  <div class="role-option-label">Coach</div>
                </div>
              </div>
            </div>
          }

          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              [(ngModel)]="email"
              name="email"
              class="form-input"
              placeholder="your@email.com"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              [(ngModel)]="password"
              name="password"
              class="form-input"
              placeholder="Enter your password"
              required
            >
          </div>

          <button 
            type="submit"
            [disabled]="loading()"
            class="btn btn-primary btn-block"
          >
            @if (loading()) {
              <span>Please wait...</span>
            } @else {
              <span>{{ isLogin() ? 'Sign In' : 'Create Account' }}</span>
            }
          </button>
        </form>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 24px;">
          By continuing, you agree to our Terms of Service
        </p>
      </div>

      <!-- DEV Button -->
      <div style="margin-top: 32px; padding: 16px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin-bottom: 12px;">— DEV OPTIONS —</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button (click)="goToHome()" style="padding: 10px 20px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; color: #6b7280;">
            🏠 Home (DEV)
          </button>
          <button (click)="goToMatches()" style="padding: 10px 20px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; color: #6b7280;">
            💬 Matches (DEV)
          </button>
          <button (click)="goToProfile()" style="padding: 10px 20px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; color: #6b7280;">
            👤 Profile (DEV)
          </button>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isLogin = signal(true);
  email = '';
  password = '';
  role = signal<'PLAYER' | 'COACH'>('PLAYER');
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    const action = this.isLogin()
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password, this.role());

    action.subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'An error occurred');
        this.loading.set(false);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToMatches(): void {
    this.router.navigate(['/matches']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
