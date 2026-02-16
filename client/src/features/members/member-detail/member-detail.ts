import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { Member } from '../../../interface/member';
import { AgePipe } from '../../../core/pipes/age-pipe';

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detail.html',
})
export class MemberDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    // Subscribe to route resolved data (from resolver)
    this.route.data.subscribe({
      next: (data) =>
        // Set the resolved 'member' data into the signal
        this.member.set(data['member']),
    });

    // Set initial child route title (e.g., Profile, Photos, etc.)
    this.title.set(this.route.firstChild?.snapshot?.title);

    // Listen for route changes (when navigating between child routes)
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Update title after child navigation completes
      this.title.set(this.route.firstChild?.snapshot.title);
    });
  }
}
