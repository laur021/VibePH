import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../../interface/apiResponse';
import { Member } from '../../interface/member';
import { PaginatedResult } from '../../interface/pagination';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http
      .post<ApiResponse<null>>(`${this.baseUrl}like/${targetMemberId}`, {})
      .subscribe({
        next: () => {
          if (this.likeIds().includes(targetMemberId)) {
            this.likeIds.update((ids) => ids.filter((x) => x !== targetMemberId));
          } else {
            this.likeIds.update((ids) => [...ids, targetMemberId]);
          }
        },
      });
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('predicate', predicate);

    return this.http
      .get<ApiResponse<PaginatedResult<Member>>>(this.baseUrl + 'like', { params })
      .pipe(map((response) => response.data));
  }

  getLikeIds() {
    return this.http.get<ApiResponse<string[]>>(this.baseUrl + 'like/list').subscribe({
      next: (response) => this.likeIds.set(response.data),
    });
  }

  clearLikeIds() {
    this.likeIds.set([]);
  }
}
