import { AlertService } from './../../core/services/alert/alert.service';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IchallengeSession } from '../../core/models/interfaces/challengeSession.interface';
import { io, Socket } from "socket.io-client";
import { environment } from '../../../environment/environment.prod';
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
  private socket!: Socket;
  isLoaded: boolean = false;
  startTime!: Date;
  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private renderer: Renderer2,
    private el: ElementRef,
    private alertService: AlertService
  ) {
    // connection
    this.socket = io(environment.SOCKET_URL);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChallengeSessionById();
      }
    });

    this.checkLostFocus()


    this.socket.on("challengeEnded", () => {
      this.alertService.showSuccess(`Challenge ended.`);
      this.getChallengeSessionById(); // Refresh challenge list
    })

    // Disable right-click
    this.renderer.listen('window', 'contextmenu', (event) => {
      event.preventDefault();
    });

    // Disable text selection
    this.el.nativeElement.style.userSelect = 'none';
  }



  getChallengeSessionById() {
    this.isLoaded = true;
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
        this.startTime = new Date(this.challenge.startTime);
        setInterval(() => {
          this.time = new Date();
        }, 1000)
        this.isLoaded = false
      },
      error: (error: any) => {
        this.isLoaded = false;
        console.error('Error fetching challenge:', error.error.message);
      },
    });
  }

  endChallenge() {
    this.alertService.showConfirm('End challenge').then((isConfirmed: any) => {
      this.isLoaded = true;
      if (isConfirmed) {
        this.challengeSessionService
          .updateChallengeSessionStatus(this.id)
          .subscribe({
            next: (res) => {
              this.getChallengeSessionById();
              this.alertService.showSuccess('Challenge ended')
              // emit the changes
              this.socket.emit("endChallenge");
              this.isLoaded = false

            },
            error: (error: any) => {
              this.isLoaded = false
              this.alertService.showError(error.error.message)
              // console.error(
              //   'Error updating challenge session status:',
              //   error.error.message
              // );
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
            this.getChallengeSessionById();
            // Emit event to the interviewer that challenge has started
            this.socket.emit("startChallenge");

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
