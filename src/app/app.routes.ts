import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { interviewerGuard } from './core/guards/interviewer/interviewer.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProjectComponent } from './core/modalComponents/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] }
  ,
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  // { path: 'interviewer', component: InterviewerComponent, canActivate: [interviewerGuard] },
  // { path: 'challenge/:id', component: ChallengeComponent, canActivate: [interviewerGuard] },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'interviewer', component: InterviewerComponent, canActivate: [interviewerGuard] },
      { path: 'projects', component: ProjectsComponent, canActivate: [interviewerGuard] },
      { path: 'challenge/:id', component: ChallengeComponent, canActivate: [interviewerGuard] },
    ]
  },

  { path: 'candidate/:id', component: CandidateComponent },


  { path: '**', redirectTo: 'candidates' },
];
