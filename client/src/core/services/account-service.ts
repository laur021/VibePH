import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { LoginCreds, RegisterCreds, User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  baseUrl = 'https://localhost:5001/api/';

  login(creds: LoginCreds) {
    return this.http.post<User>(this.baseUrl + 'accounts/login', creds).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  logout() {
    this.removeCurrentUser();
  }

  register(registerCreds: RegisterCreds) {
    return this.http.post<User>(this.baseUrl + 'accounts/register', registerCreds).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  // helper methods
  private setCurrentUser(user: User) {
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private removeCurrentUser() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }
}
