import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../interface/apiResponse';
import { EditableMember, Member } from '../../interface/member';
import { Photo } from '../../interface/photo';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.apiUrl;
  public isEditMode = signal<boolean>(false);
  member = signal<Member | null>(null);

  getMembers() {
    return this.http
      .get<ApiResponse<Member[]>>(this.baseUrl + 'members')
      .pipe(map((response) => response.data));
  }

  getMember(id: string) {
    return this.http
      .get<ApiResponse<Member>>(`${this.baseUrl}members/${id}`)
      .pipe(tap((response) => this.member.set(response.data)));
  }

  getMemberPhotos(id: string) {
    return this.http
      .get<ApiResponse<Photo[]>>(this.baseUrl + 'members/' + id + '/photos')
      .pipe(map((response) => response.data));
  }

  updateMember(member: EditableMember) {
    return this.http.put<ApiResponse<null>>(this.baseUrl + 'members/', member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<Photo>>(this.baseUrl + 'members/add-photo', formData)
      .pipe(map((response) => response.data));
  }

  setMainPhoto(photoId: number) {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}members/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}members/delete-photo/${photoId}`,
      {},
    );
  }
}
