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
  selector: 'app-interview-session',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './interview-session.component.html',
  styleUrl: './interview-session.component.css'
})
export class InterviewSessionComponent implements OnInit {
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
    this.interviewerData = this.authService.getDecodedToken()
    this.sessionForm = this.fb.group({
      interviewer: [this.interviewerData._id, [Validators.required]],
      organization: [this.interviewerData._activeOrg, [Validators.required]],
      candidateName: ['', [Validators.required]],
    });
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
        },
      });
  }

  ontoggleCreateInterviewSessionModal() {
    this.toggleCreateInterviewSessionModal.emit();
  }
}
