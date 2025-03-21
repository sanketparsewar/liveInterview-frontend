import { Routes } from '@angular/router';
import { CandidateComponent } from './pages/candidate/candidate.component';
import { InterviewerComponent } from './pages/interviewer/interviewer.component';
import { ChallengeComponent } from './pages/challenge/challenge.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { interviewerGuard } from './core/guards/interviewer/interviewer.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { WebCameraComponent } from './core/components/web-camera/web-camera.component';
import { ReviewCodeComponent } from './core/components/review-code/review-code.component';
import { ReportComponent } from './pages/report/report.component';

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
      { path: 'report', component: ReportComponent },
      { path: 'challenge/:id', component: ChallengeComponent },
      { path: 'review-code/:id', component: ReviewCodeComponent }
    ]
  },

  { path: 'candidate/:id', component: CandidateComponent },
  {path:'camera',component: WebCameraComponent},


  { path: '**', redirectTo: 'candidates' },
];
