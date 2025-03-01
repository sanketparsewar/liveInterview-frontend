import { Component } from '@angular/core';
import { InterviewSessionService } from '../../services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';
import { CreateSessionComponent } from '../../modalComponents/create-session/create-session.component';
import { ChallengeSessionComponent } from '../../modalComponents/challenge-session/challenge-session.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-session-table',
  imports: [CommonModule,CreateSessionComponent],
  templateUrl: './interview-session-table.component.html',
  styleUrl: './interview-session-table.component.css',
})
export class InterviewSessionTableComponent {
  interviewSessionsList: any;
  isToggleModal: boolean = false;
  istoggleCreateInterviewSessionModal:boolean = false;
  constructor(private router:Router,private interviewSessionService: InterviewSessionService) {}
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
    this.interviewSessionService.getAllInterviewSessions().subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res;
      },
      error: (error: any) => {
        console.error('Error fetching sessions:', error.error.message);
      },
    });
  }
  candidate(id:string){
    this.router.navigate(['challenge',id])
    console.log('interviewsession ID:', id);
  }
}
