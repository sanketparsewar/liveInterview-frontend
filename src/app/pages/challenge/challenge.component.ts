import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-challenge',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css',
})
export class ChallengeComponent implements OnInit {
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private challengeSessionService: ChallengeSessionService) { };
  challengeForm!: FormGroup;
  id: string = ''
  challenges: any[] = []
  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        console.log('Interview ID:', params['id']);
        this.challengeForm = this.fb.group({
          name: [''],
          stackBlitzUrl: [''],
          interviewSessionId: [this.id],
        });
      }
    })
    this.getAllChallenges();
  }

  getAllChallenges() {
    this.challengeSessionService.getChallengeSessionsByInterviewId(this.id).subscribe({
      next: (res: any) => {
        this.challenges = res.challengeSessions;
        console.log('Challenges:', res);
      },
      error: (error: any) => {
        console.error('Error fetching challenges:', error.error.message);
      },
    })
  }
  createChallenge() {
    this.challengeSessionService.createChallengeSession(this.challengeForm.value).subscribe({
      next: (res) => {
        console.log('Challenge created successfully:', res);
        this.getAllChallenges();
        this.reset()
      },
      error: (error: any) => {
        console.error('Error creating challenge:', error.error.message);
      },
    });
  }

  copyToClipboard(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  startChallenge(id: string) {
    this.challengeSessionService.startChallenge(id).subscribe({
      next: (res) => {
        console.log('Challenge session status updated successfully:', res);
        this.getAllChallenges();
      },
      error: (error: any) => {
        console.error('Error updating challenge session status:', error.error.message);
      },
    });
  }
  updateChallengeSessionStatus(id: string) {
    this.challengeSessionService.updateChallengeSessionStatus(id).subscribe({
      next: (res) => {
        console.log('Challenge session status updated successfully:', res);
        this.getAllChallenges();
      },
      error: (error: any) => {
        console.error('Error updating challenge session status:', error.error.message);
      },
    });
  }

  // getTotalTime(startTime: string, endTime: string): string {
  //   const start = new Date(startTime);
  //   const end = new Date(endTime);
  
  //   if (isNaN(start.getTime()) || isNaN(end.getTime())) {
  //     return "Invalid Time";
  //   }
  
  //   const diffMs = end.getTime() - start.getTime(); // Difference in milliseconds
  //   const diffMinutes = Math.floor((diffMs / 1000) / 60); // Convert to minutes
  //   const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
  //   const remainingMinutes = diffMinutes % 60;
  
  //   return `${diffHours}h ${remainingMinutes}m`;
  // }
  

  reset() {
    this.challengeForm = this.fb.group({
      name: [''],
      stackBlitzUrl: [''],
      interviewSessionId: [this.id],
    })
  }
}
