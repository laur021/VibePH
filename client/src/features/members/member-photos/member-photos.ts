import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../interface/photo';

@Component({
  selector: 'app-member-photos',
  imports: [],
  templateUrl: './member-photos.html',
})
export class MemberPhotos {
  private membeService = inject(MemberService);
  private route = inject(ActivatedRoute);

  protected photos = toSignal(
    this.membeService.getMemberPhotos(this.route.parent?.snapshot.paramMap.get('id')!),
    {
      initialValue: [] as Photo[],
    },
  );

  get photoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png',
    }));
  }
}
