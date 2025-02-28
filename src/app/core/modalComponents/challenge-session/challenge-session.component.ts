import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChallengeSessionService } from '../../services/challengeSession/challenge-session.service';

@Component({
  selector: 'app-challenge-session',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './challenge-session.component.html',
  styleUrl: './challenge-session.component.css',
})
export class ChallengeSessionComponent {
  session: any;
  sessionForm!: FormGroup;
  @Output() toggleCreateChallengeSessionModal = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private challengeSessionService: ChallengeSessionService
  ) {}

  ngOnInit() {
    this.sessionForm = this.fb.group({
      name: ['', [Validators.required]],
      challengeSessionId: ['', [Validators.required]],
      stackBlitzUrl: ['', [Validators.required]],
    });
  }

  createChallengeSession() {
    this.challengeSessionService
      .createChallengeSession(this.sessionForm.value)
      .subscribe({
        next: (res) => {
          console.log('Session created successfully:', res);
          this.ontoggleCreateChallengeSessionModal();
          alert('Session created successfully');
        },
        error: (error: any) => {
          console.error('Error creating session:', error.error.message);
        },
      });
  }

  ontoggleCreateChallengeSessionModal() {
    this.toggleCreateChallengeSessionModal.emit();
  }
}
