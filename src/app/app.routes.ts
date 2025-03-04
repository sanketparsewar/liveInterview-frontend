import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { interviewerGuard } from './core/guards/interviewer/interviewer.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  { path: 'interviewer', component: InterviewerComponent,canActivate:[interviewerGuard]},
  { path: 'candidate/:id', component: CandidateComponent,canActivate:[interviewerGuard]},
  { path: 'challenge/:id', component: ChallengeComponent,canActivate:[interviewerGuard]},

  {path:'login',component:LoginComponent,canActivate:[authGuard]},


  { path: '**', redirectTo: 'candidates' },
];
