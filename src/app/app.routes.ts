import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  { path: 'candidate', component: CandidateComponent },
  { path: 'interviewer', component: InterviewerComponent },
  { path: '**', redirectTo: 'candidates' },
];
