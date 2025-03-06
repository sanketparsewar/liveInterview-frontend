import { AlertService } from './../../services/alert/alert.service';
import { Component } from '@angular/core';
import { InterviewSessionService } from '../../services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IinterviewSession } from '../../models/interfaces/interviewSession.interface';
import { InterviewSessionComponent } from '../../modalComponents/interview-session/interview-session.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview-session-table',
  imports: [CommonModule, InterviewSessionComponent,FormsModule],
  templateUrl: './interview-session-table.component.html',
  styleUrl: './interview-session-table.component.css',
})
export class InterviewSessionTableComponent {
  interviewSessionsList: IinterviewSession[] = [];
  isToggleModal: boolean = false;
  isToggleDropdown: boolean = false;
  istoggleCreateInterviewSessionModal: boolean = false;
  interviewerData: any | null = null;
  isLoaded:boolean = false;
  queryParameters:any={
    newest:'',
    oldest:'',
    order:'',
    search:'',
  }
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

  searchSessions(event: any) {
    this.queryParameters.search=event.target.value;
    // this.getInterviewSessions();
  }

  sort(event: any) {
    this.queryParameters.order=event.target.value;
    console.log(event.target.value)
    // this.getInterviewSessions();
  }


  toggleModal() {
    this.isToggleModal = !this.isToggleModal;
  }
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }

  toggleCreateInterviewSessionModal() {
    this.istoggleCreateInterviewSessionModal =
      !this.istoggleCreateInterviewSessionModal;
  }


  getInterviewSessions() {
    this.isLoaded=true;
    this.interviewSessionService.getAllInterviewSessions(this.interviewerData.firstName).subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res.interviewSessions;
        this.isLoaded=false
      },
      error: (error: any) => {
        this.isLoaded=false;
        this.alertService.showError(error.error.message)
        // console.error('Error fetching sessions:', error.error.message);
      },
    });
  }

  endSession(id: string) {
    this.alertService.showConfirm('Update status').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.isLoaded=true;
        this.interviewSessionService
          .updateInterviewSessionStatus(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess(
                'Session status updated successfully'
              );
              this.getInterviewSessions();
              this.isLoaded=false
            },
            error: (error: any) => {
              this.isLoaded=false;
              this.alertService.showError(error.error.message);
              // console.error('Error updating status:', error.error.message);
            },
          });
      }
    });
  }

  deleteInterviewSessionById(id: string) {
    this.alertService.showConfirm('Delete session').then((isConfirmed: any) => {
      this.isLoaded=true;
      if (isConfirmed) {
        this.interviewSessionService
          .deleteInterviewSessionById(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess('Session deleted.');
              this.getInterviewSessions();
              this.isLoaded=false
            },
            error: (error: any) => {
              this.isLoaded=false;
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
