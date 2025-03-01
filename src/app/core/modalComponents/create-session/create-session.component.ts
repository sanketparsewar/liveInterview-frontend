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
  session: any;
  sessionForm!: FormGroup;
  @Output() toggleCreateInterviewSessionModal = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private interviewSessionService: InterviewSessionService
  ) { }

  ngOnInit() {
    this.sessionForm = this.fb.group({
      candidateName: ['', [Validators.required]],
    });
  }

  createInterviewSession() {
    this.interviewSessionService
      .createInterviewSession(this.sessionForm.value)
      .subscribe({
        next: (res) => {
          this.ontoggleCreateInterviewSessionModal();
        },
        error: (error: any) => {
          console.error('Error creating session:', error.error.message);
        },
      });
  }

  ontoggleCreateInterviewSessionModal() {
    this.toggleCreateInterviewSessionModal.emit();
  }
}
