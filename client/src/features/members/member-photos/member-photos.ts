import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { Member } from '../../../interface/member';
import { Photo } from '../../../interface/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { StarButton } from '../../../shared/star-button/star-button';
import { DeleteButton } from '../../../shared/delete-button/delete-button';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
})
export class MemberPhotos {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);
  protected isCurrentUser = computed(
    () => this.accountService.currentUser()?.id === this.route.parent?.snapshot.paramMap.get('id'),
  );

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.isEditMode.set(false);
        this.loading.set(false);
        this.photos.update((photos) => [...photos, photo]);
      },
      error: (error) => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      },
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: (res) => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          this.accountService.setCurrentUser({ ...currentUser, imageUrl: photo.url });
        }

        this.memberService.member.update(
          (member) =>
            ({
              ...member,
              imageUrl: photo.url,
            }) as Member,
        );

        this.toast.success(res.message);
      },
      error: (res) => {
        this.toast.error(res.message);
      },
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update((photos) => photos.filter((x) => x.id !== photo.id));
      },
      error: (res) => {
        this.toast.error(res.message);
      },
    });
  }
}
