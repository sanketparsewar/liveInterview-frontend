import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  { path: 'interviewer', component: InterviewerComponent },
  { path: 'candidate/:id', component: CandidateComponent },
  { path: 'challenge/:id', component: ChallengeComponent },

  {path:'login',component:LoginComponent},


  { path: '**', redirectTo: 'candidates' },
];
