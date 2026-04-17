import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';


  currentUser = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, { username, email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { username, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {})
      .pipe(tap(() => this.clearSession()));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private loadUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
