import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';

export const routes: Routes = [
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  { path: 'candidate/:id', component: CandidateComponent },
  { path: 'interviewer', component: InterviewerComponent },
  { path: 'challenge/:id', component: ChallengeComponent },
  { path: '**', redirectTo: 'candidates' },
];
