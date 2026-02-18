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
  protected readonly activeChildPath = signal<string | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected member = signal<Member | undefined>(undefined);
  protected isCurrentUser = computed(
    () => this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id'),
  );

  ngOnInit(): void {
    // Subscribe to route resolved data (from resolver)
    this.route.data.subscribe({
      next: (data) => this.member.set(data['member']), // Set the resolved 'member' data into the signal
    });

    const child = this.route.firstChild; // Get the currently active child route (e.g. 'profile', 'photos', 'messages')
    this.activeChildPath.set(child?.routeConfig?.path); // and store its configured path so we can react to which tab is active
    this.title.set(this.route.firstChild?.snapshot?.title); // Set initial child route title (e.g., Profile, Photos, etc.)

    // Listen for route changes (when navigating between child routes)
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const child = this.route.firstChild;
      this.activeChildPath.set(child?.routeConfig?.path);
      this.title.set(this.route.firstChild?.snapshot.title); // Update title after child navigation completes
      this.memberService.isEditMode.set(false); // Reset edit mode when navigating to a different child route
    });
  }

  protected readonly showEditButton = computed(
    () => this.isCurrentUser() && this.activeChildPath() === 'profile',
  );
}
