import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { apiEndpoints } from '../api-endpoints';

interface LoginResponse {
  token?: string;
  access_token?: string;
  data?: {
    token?: string;
    access_token?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'nsp_admin_auth';

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(apiEndpoints.login, { username, password })
      .pipe(tap((response) => this.storeSession(response)));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  private storeSession(response: LoginResponse): void {
    const token = response.token ?? response.access_token ?? response.data?.token ?? response.data?.access_token;
    localStorage.setItem(this.storageKey, token ?? 'authenticated');
  }
}
