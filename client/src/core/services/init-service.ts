import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AccountService } from './account-service';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private likeService = inject(LikeService);
  init() {
    const userString = localStorage.getItem('user');
    if (!userString) of(null);
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
      this.likeService.getLikeIds();
    }

    return of(null);
  }
}
