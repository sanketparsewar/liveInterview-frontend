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
  lostFocusCount: number = 0
  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertService
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChallengeSessionById();
      }
    });


    // Disable right-click
    this.renderer.listen('window', 'contextmenu', (event) => {
      event.preventDefault();
    });

    // Disable text selection
    this.el.nativeElement.style.userSelect = 'none';
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
        this.endChallenge()
        this.alertService.showSuccess('Challenge Ended.');
      }
    });
  }

  endChallenge() {
    this.challengeSessionService
      .updateChallengeSessionStatus(this.id)
      .subscribe({
        next: (res) => {
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

  startChallenge(id: string) {
    this.alertService.showConfirm('start the challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.goFullScreen();
        this.challengeSessionService.startChallenge(id).subscribe({
          next: (res) => {
            this.time = new Date();
            this.getChallengeSessionById();
            this.checkLostFocus()
            setInterval(() => {
              this.time = new Date();
            }, 1000)
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

  checkLostFocus() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== 'visible') {
        this.lostFocusCount++;
        this.alertService.showWarning(`Tab change detected.`)
      }
    })
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
