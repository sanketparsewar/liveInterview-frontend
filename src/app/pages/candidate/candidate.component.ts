import { AlertService } from './../../core/services/alert/alert.service';
import {
  Component,
  OnInit,
  HostListener,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css',
})
export class CandidateComponent implements OnInit {
  time!: Date;
  id: string = '';
  challenge: any;
  safeStackBlitzUrl!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    this.getChallengeSessionById();

    // Disable right-click
    this.renderer.listen('window', 'contextmenu', (event) => {
      event.preventDefault();
    });

    // Disable copy, cut, paste and show alert for copy/paste
    this.renderer.listen('window', 'copy', (event) => {
      event.preventDefault();
      alert('Copying content is not allowed!');
    });

    this.renderer.listen('window', 'paste', (event) => {
      event.preventDefault();
      alert('Pasting content is not allowed!');
    });

    this.renderer.listen('window', 'cut', (event) => {
      event.preventDefault();
    });

    // Disable text selection
    this.el.nativeElement.style.userSelect = 'none';
  }

  // Prevent keyboard shortcuts like Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, F12, etc.
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'c') {
      alert('Copying content is not allowed!');
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'v') {
      alert('Pasting content is not allowed!');
      event.preventDefault();
    } else if (
      (event.ctrlKey &&
        (event.key === 'x' ||
          event.key === 'u' ||
          event.key === 's' ||
          event.key === 'i' ||
          event.key === 'j')) ||
      event.key === 'F12'
    ) {
      event.preventDefault();
    }
  }

  getChallengeSessionById() {
    this.challengeSessionService.getChallengeSessionById(this.id).subscribe({
      next: (res: any) => {
        this.challenge = res;

        if (
          this.challenge.stackBlitzUrl &&
          typeof this.challenge.stackBlitzUrl === 'string'
        ) {
          this.safeStackBlitzUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              this.challenge.stackBlitzUrl
            );
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
    this.alertService.showConfirm('End challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService
          .updateChallengeSessionStatus(this.id)
          .subscribe({
            next: (res) => {
              this.alertService.showSuccess('Challenge Ended.');
              this.getChallengeSessionById();
            },
            error: (error: any) => {
              console.error(
                'Error updating challenge session status:',
                error.error.message
              );
            },
          });
      }
    });
  }

  startChallenge(id: string) {
    this.alertService.showConfirm('start the challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.goFullScreen();
        this.challengeSessionService.startChallenge(id).subscribe({
          next: (res) => {
            this.time = new Date();
            this.getChallengeSessionById();
          },
          error: (error: any) => {
            console.error(
              'Error updating challenge session status:',
              error.error.message
            );
          },
        });
      }
    });
  }

  goFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
  }
}
