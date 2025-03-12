import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { interviewerGuard } from './core/guards/interviewer/interviewer.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { StackblitzCodeComponent } from './core/components/stackblitz-code/stackblitz-code.component';
import { WebCameraComponent } from './core/components/web-camera/web-camera.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'interviewer', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild:[interviewerGuard],
    children: [
      { path: 'interviewer', component: InterviewerComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'challenge/:id', component: ChallengeComponent },
      { path: 'stackblitzcode/:id', component: StackblitzCodeComponent }
    ]
  },

  { path: 'candidate/:id', component: CandidateComponent },
  {path:'camera',component: WebCameraComponent},


  { path: '**', redirectTo: 'candidates' },
];
