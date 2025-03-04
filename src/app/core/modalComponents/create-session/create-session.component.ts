import { AlertService } from './../../services/alert/alert.service';
import {
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { InterviewSessionService } from './../../services/interviewSession/interview-session.service';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-create-session',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css',
})
export class CreateSessionComponent implements OnInit {
  sessionForm!: FormGroup;
  @Output() toggleCreateInterviewSessionModal = new EventEmitter();
  @Output() getAllInterviewSessions = new EventEmitter();
  interviewerData: any;
  constructor(
    private fb: FormBuilder,
    private interviewSessionService: InterviewSessionService,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.interviewerData = this.getLoggedInterviewer()
    this.sessionForm = this.fb.group({
      interviewerName: [this.interviewerData.firstName, [Validators.required]],
      candidateName: ['', [Validators.required]],
    });
  }

  getLoggedInterviewer() {
    return this.authService.getLoggedInterviewer();
  }


  createInterviewSession() {
    this.interviewSessionService
      .createInterviewSession(this.sessionForm.value)
      .subscribe({
        next: (res) => {
          this.alertService.showSuccess('Session created successfully!');
          this.ontoggleCreateInterviewSessionModal();
          this.getAllInterviewSessions.emit()
        },
        error: (error: any) => {
          this.alertService.showError(error.error.message);
          // console.error('Error creating session:', error.error.message);
        },
      });
  }

  ontoggleCreateInterviewSessionModal() {
    this.toggleCreateInterviewSessionModal.emit();
  }
}
