import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AccountService } from '../core/services/account-service';
import { Home } from '../features/home/home';
import { Nav } from '../layout/nav/nav';
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  private http = inject(HttpClient);
  protected readonly title = signal('client');
  protected members = signal<User[]>([]);
  protected router = inject(Router);

  async ngOnInit() {
    this.setCurrentUser();
    this.members.set((await this.getMembers()) as User[]);
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');

    if (!userString) return;

    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    }
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }
}
