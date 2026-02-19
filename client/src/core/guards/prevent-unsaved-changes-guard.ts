import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  // Check if form exists and has been modified
  if (component.form?.dirty) {
    // Native confirm dialog
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
  }
  return true;
};
