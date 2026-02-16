import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { Member } from '../../../interface/member';

@Component({
  selector: 'app-member-detail',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detail.html',
})
export class MemberDetail implements OnInit {
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  protected member = signal<Member | undefined>(undefined);
  protected isCurrentUser = computed(
    () => this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id'),
  );

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
      // Reset edit mode when navigating to a different child route
      this.memberService.isEditMode.set(false);
    });
  }
}
