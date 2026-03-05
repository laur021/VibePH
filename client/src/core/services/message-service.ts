import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../interface/apiResponse';
import { Message } from '../../interface/message';
import { PaginatedResult } from '../../interface/pagination';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);

    return this.http
      .get<ApiResponse<PaginatedResult<Message>>>(this.baseUrl + 'messages', { params })
      .pipe(map((response) => response.data));
  }

  getMessageThread(memberId: string) {
    return this.http
      .get<ApiResponse<Message[]>>(this.baseUrl + 'messages/thread/' + memberId)
      .pipe(map((response) => response.data));
  }

  deleteMessage(id: string) {
    return this.http.delete<ApiResponse<null>>(this.baseUrl + 'messages/' + id);
  }
}
