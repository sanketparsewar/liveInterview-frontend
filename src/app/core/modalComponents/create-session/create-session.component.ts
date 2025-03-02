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

  constructor(
    private fb: FormBuilder,
    private interviewSessionService: InterviewSessionService,
    private alertService:AlertService
  ) { }

  ngOnInit() {
    this.sessionForm = this.fb.group({
      interviewerName: ['Sanket', [Validators.required]],
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
          // console.error('Error creating session:', error.error.message);
        },
      });
  }

  ontoggleCreateInterviewSessionModal() {
    this.toggleCreateInterviewSessionModal.emit();
  }
}
