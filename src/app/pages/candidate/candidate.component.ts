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
import { IchallengeSession } from '../../core/models/interfaces/challengeSession.interface';

@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css',
})
export class CandidateComponent implements OnInit {
  time!: Date;
  id: string = '';
  challenge!: IchallengeSession;
  safeStackBlitzUrl!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertService
  ) { }

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

    // Disable text selection
    this.el.nativeElement.style.userSelect = 'none';
  }

  // Prevent keyboard shortcuts like Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, F12, etc.
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): boolean {
    // Define forbidden key combinations
    const forbiddenKeys = [
      { ctrl: true, key: 'c' }, // Ctrl + C (Copy)
      { ctrl: true, key: 'v' }, // Ctrl + V (Paste)
      { ctrl: true, key: 'x' }, // Ctrl + X (Cut)
      { ctrl: true, key: 'u' }, // Ctrl + U (View Source)
      { ctrl: true, key: 's' }, // Ctrl + S (Save)
      { ctrl: true, key: 'i' }, // Ctrl + I (DevTools)
      { ctrl: true, shift: true, key: 'I' }, // Ctrl + Shift + I
      { ctrl: true, shift: true, key: 'J' }, // Ctrl + Shift + J
      { ctrl: true, shift: true, key: 'C' }, // Ctrl + Shift + C (Inspect Element)
      { key: 'F12' }, // F12 (DevTools)
      { key: 'PrintScreen' }, // Print Screen
    ];

    // Check if the pressed key combination is in the forbidden list
    for (const shortcut of forbiddenKeys) {
      if (
        (shortcut.ctrl && event.ctrlKey && event.key.toLowerCase() === shortcut.key.toLowerCase()) ||
        (shortcut.shift && event.shiftKey && event.key.toLowerCase() === shortcut.key.toLowerCase()) ||
        (!shortcut.ctrl && !shortcut.shift && event.key === shortcut.key)
      ) {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Stop event from propagating
        return false; // Return false to block the action
      }
    }
    return true; // Allow other keys to function normally
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
