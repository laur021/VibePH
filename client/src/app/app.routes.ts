import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { Home } from '../features/home/home';
import { Lists } from '../features/lists/lists';
import { MemberDetail } from '../features/members/member-detail/member-detail';
import { MemberList } from '../features/members/member-list/member-list';
import { Messages } from '../features/messages/messages';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberList },
      { path: 'members/:id', component: MemberDetail },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
    ],
  },

  { path: '**', component: Home }, // wildcard fallback
];
