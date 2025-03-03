import { CanActivateFn } from '@angular/router';

export const interviewerGuard: CanActivateFn = (route, state) => {
  return true;
};
