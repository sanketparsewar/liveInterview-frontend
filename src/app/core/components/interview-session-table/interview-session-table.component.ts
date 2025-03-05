import { AlertService } from './../../services/alert/alert.service';
import { Component } from '@angular/core';
import { InterviewSessionService } from '../../services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IinterviewSession } from '../../models/interfaces/interviewSession.interface';
import { InterviewSessionComponent } from '../../modalComponents/interview-session/interview-session.component';

@Component({
  selector: 'app-interview-session-table',
  imports: [CommonModule, InterviewSessionComponent],
  templateUrl: './interview-session-table.component.html',
  styleUrl: './interview-session-table.component.css',
})
export class InterviewSessionTableComponent {
  interviewSessionsList: IinterviewSession[] = [];
  isToggleModal: boolean = false;
  istoggleCreateInterviewSessionModal: boolean = false;
  interviewerData: any | null = null;
  constructor(
    private router: Router,
    private interviewSessionService: InterviewSessionService,
    private alertService: AlertService,
  ) {
    if (localStorage.getItem('user')) {
      this.interviewerData = JSON.parse(localStorage.getItem('user')!);
    }
  }
  ngOnInit() {
    this.getInterviewSessions();
  }
  toggleModal() {
    this.isToggleModal = !this.isToggleModal;
  }

  toggleCreateInterviewSessionModal() {
    this.istoggleCreateInterviewSessionModal =
      !this.istoggleCreateInterviewSessionModal;
  }


  getInterviewSessions() {
    this.interviewSessionService.getAllInterviewSessions(this.interviewerData.firstName).subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res.interviewSessions;
      },
      error: (error: any) => {
        console.error('Error fetching sessions:', error.error.message);
      },
    });
  }

  updateInterviewSessionStatus(id: string) {
    this.alertService.showConfirm('Update status').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.interviewSessionService
          .updateInterviewSessionStatus(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess(
                'Session status updated successfully'
              );
              this.getInterviewSessions();
            },
            error: (error: any) => {
              this.alertService.showError(error.error.message);
              // console.error('Error updating status:', error.error.message);
            },
          });
      }
    });
  }

  deleteInterviewSessionById(id: string) {
    this.alertService.showConfirm('Delete session').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.interviewSessionService
          .deleteInterviewSessionById(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess('Session deleted.');
              this.getInterviewSessions();
            },
            error: (error: any) => {
              this.alertService.showError(error.error.message);
              // console.error('Error deleting session:', error.error.message);
            },
          });
      }
    });
  }


  candidate(id: string) {
    this.router.navigate(['challenge', id]);
  }
}
