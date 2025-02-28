import { Component } from '@angular/core';
import { InterviewSessionService } from '../../services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interview-session-table',
  imports: [CommonModule],
  templateUrl: './interview-session-table.component.html',
  styleUrl: './interview-session-table.component.css'
})
export class InterviewSessionTableComponent {

  interviewSessionsList: any;

  constructor(private interviewSessionService: InterviewSessionService) {}
  ngOnInit() {
    this.getInterviewSessions();
  }
 
  getInterviewSessions() {
    this.interviewSessionService.getAllInterviewSessions().subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res.interviewSessions;
        console.log('All sessions:', res.interviewSessions);
      },
      error: (error: any) => {
        console.error('Error fetching sessions:', error.error.message);
      },
    });
  }
}
