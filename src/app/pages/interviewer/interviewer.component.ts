import { AlertService } from './../../core/services/alert/alert.service';
import { InterviewSessionTableComponent } from './../../core/components/interview-session-table/interview-session-table.component';
import { InterviewSessionService } from './../../core/services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreateSessionComponent } from '../../core/modalComponents/create-session/create-session.component';
import { ProjectComponent } from '../../core/modalComponents/project/project.component';

@Component({
  selector: 'app-interviewer',
  imports: [CommonModule, ProjectComponent, InterviewSessionTableComponent],
  templateUrl: './interviewer.component.html',
  styleUrl: './interviewer.component.css',
})
export class InterviewerComponent implements OnInit {
  isToggleDropdown: boolean = false;
  istoggleCreateInterviewSessionModal: boolean = false;
  isToggleProjectModal: boolean = false;
  interviewSessionsList: any;

  constructor(private interviewSessionService: InterviewSessionService,private alertService:AlertService) { }
  ngOnInit() {

  }
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }
  toggleCreateInterviewSessionModal() {
    this.istoggleCreateInterviewSessionModal =
      !this.istoggleCreateInterviewSessionModal;
  }
  toggleProjectModal() {
    this.isToggleProjectModal = !this.isToggleProjectModal;
  }

  getInterviewSessions() {
    this.interviewSessionService.getAllInterviewSessions().subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res.interviewSessions;
      },
      error: (error: any) => {
        this.alertService.showError('Error fetching sessions');
        // console.error('Error fetching sessions:', error.error.message);
      },
    });
  }
}
