import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../interface/apiResponse';
import { LoginCreds, RegisterCreds, User } from '../../interface/user';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private likeService = inject(LikeService);
  currentUser = signal<User | null>(null);

  baseUrl = environment.apiUrl;

  login(creds: LoginCreds) {
    return this.http.post<ApiResponse<User>>(this.baseUrl + 'accounts/login', creds).pipe(
      map((response) => response.data), // 👈 extract only the user
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  logout() {
    this.removeCurrentUser();
    localStorage.removeItem('theme');
    localStorage.removeItem('filters'); // reset persisted filters
  }

  register(registerCreds: RegisterCreds) {
    return this.http
      .post<ApiResponse<User>>(this.baseUrl + 'accounts/register', registerCreds)
      .pipe(
        map((response) => response.data), // 👈 extract only the user
        tap((user) => {
          this.setCurrentUser(user);
        }),
      );
  }

  // helper methods
  setCurrentUser(user: User) {
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.likeService.getLikeIds(); // load like IDs when user logs in or registers
    }
  }

  private removeCurrentUser() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.likeService.clearLikeIds(); // clear like IDs when user logs out
  }
}
