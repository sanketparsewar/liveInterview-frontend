import { InterviewSessionTableComponent } from './../../core/components/interview-session-table/interview-session-table.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-interviewer',
  imports: [CommonModule, InterviewSessionTableComponent],
  templateUrl: './interviewer.component.html',
  styleUrl: './interviewer.component.css',
})
export class InterviewerComponent implements OnInit {
  isToggleDropdown: boolean = false;
  interviewerData: any;
  constructor(private authService: AuthService) { }
  ngOnInit() {
    this.interviewerData = this.getLoggedInterviewer()
  }
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }

  getLoggedInterviewer() {
    return this.authService.getLoggedInterviewer();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

}
