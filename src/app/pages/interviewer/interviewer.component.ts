import { InterviewSessionTableComponent } from './../../core/components/interview-session-table/interview-session-table.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interviewer',
  imports: [CommonModule, InterviewSessionTableComponent],
  templateUrl: './interviewer.component.html',
  styleUrl: './interviewer.component.css',
})
export class InterviewerComponent implements OnInit {
  isToggleDropdown: boolean = false;
  interviewerData: any;
  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }
  ngOnInit() {
    this.interviewerData = this.authService.getLoggedInterviewer();
  }
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }

}
