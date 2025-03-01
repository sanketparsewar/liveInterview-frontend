import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate',
  imports: [FormsModule,CommonModule],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css'
})
export class CandidateComponent implements OnInit {

  constructor( private sanitizer: DomSanitizer,private activatedRoute:ActivatedRoute,private challengeSessionService:ChallengeSessionService) { }
  id: string = ''
  challenge:any;
  safeStackBlitzUrl!: SafeResourceUrl;
  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        // console.log('Interview ID:', params['id']);
      }
    })
    this.getChallengeSessionById();
  }

  getChallengeSessionById() {
    this.challengeSessionService.getChallengeSessionById(this.id).subscribe({
      next: (res: any) => {
        this.challenge = res;
        console.log('Challenge:', this.challenge);
  
        if (this.challenge.stackBlitzUrl && typeof this.challenge.stackBlitzUrl === 'string') {
          this.safeStackBlitzUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.challenge.stackBlitzUrl);
        } else {
          console.log('Invalid StackBlitz URL:', this.challenge.stackBlitzUrl);
        }
      },
      error: (error: any) => {
        console.error('Error fetching challenge:', error.error.message);
      },
    });
  }

  updateChallengeSessionStatus() {
    this.challengeSessionService.updateChallengeSessionStatus(this.id).subscribe({
      next: (res) => {
        console.log('Challenge session status updated successfully:', res);
        this.getChallengeSessionById();
      },
      error: (error: any) => {
        console.error('Error updating challenge session status:', error.error.message);
      },
    });
  }
  
  startChallenge(id: string) {
    this.challengeSessionService.startChallenge(id).subscribe({
      next: (res) => {
        console.log('Challenge session status updated successfully:', res);
        this.getChallengeSessionById();
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
}
