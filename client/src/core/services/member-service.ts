import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../interface/apiResponse';
import { Member } from '../../interface/member';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;

  getMembers() {
    return this.http
      .get<ApiResponse<Member[]>>(this.baseUrl + 'members')
      .pipe(map((response) => response.data));
  }

  getMember(id: string) {
    return this.http
      .get<ApiResponse<Member>>(this.baseUrl + 'members/' + id)
      .pipe(map((response) => response.data));
  }
}
