import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: 'PLAYER' | 'COACH' | 'ADMIN';
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    if (typeof localStorage === 'undefined') return;
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  register(email: string, password: string, role: 'PLAYER' | 'COACH'): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/users/register`, { email, password, role }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('token');
  }
}
