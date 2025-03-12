import { AlertService } from './../../core/services/alert/alert.service';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IchallengeSession } from '../../core/models/interfaces/challengeSession.interface';
import { io, Socket } from "socket.io-client";
import { environment } from '../../../environment/environment.prod';
import { StackblitzCodeComponent } from '../../core/components/stackblitz-code/stackblitz-code.component';

@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule, StackblitzCodeComponent],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css',
})
export class CandidateComponent implements OnInit {
  time!: Date;
  id: string = '';
  challenge!: IchallengeSession;
  lostFocusCount: number = 0
  private socket!: Socket;
  isLoaded: boolean = false;
  startTime!: Date;
  constructor(
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
    console.log(this.lostFocusCount)


    this.socket.on("challengeEnded", () => {
      this.alertService.showSuccess(`Challenge ended.`);
      // this.getChallengeSessionById(); // Refresh challenge list
    })

    // Disable right-click
    this.renderer.listen('window', 'contextmenu', (event) => {
      event.preventDefault();
    });

    // Prevent window close or refresh
    window.addEventListener("beforeunload", (event) => {
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

        if (this.challenge.startTime && !this.challenge.endTime) {
          this.checkLostFocus()
        }

        this.startTime = new Date(this.challenge.startTime);
        setInterval(() => {
          this.time = new Date();
        }, 1000)
        this.isLoaded = false
      },
      error: (error: any) => {
        this.isLoaded = false;
      },
    });
  }


  endChallenge() {
    this.alertService.showConfirm('end challenge (save code before exit) ').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.terminateChallenge()
        console.log(this.lostFocusCount)
      }
    });
  }

  terminateChallenge() {
    this.isLoaded = true;
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

  startChallenge(id: string) {
    this.alertService.showConfirm('start the challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.goFullScreen();
        this.challengeSessionService.startChallenge(id).subscribe({
          next: (res) => {
            if (this.challenge.startTime && !this.challenge.endTime) {
              this.checkLostFocus()
            }

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
      if (document.visibilityState === 'hidden') {
        // this.lostFocusCount++;
        this.updateLostFocus()
        // this.alertService.showWarning(`Warning exceeded. Test will auto submit in 5 seconds`)
        // setTimeout(() => {
        //   this.terminateChallenge();
        // }, 5000);
      }
      // else if (document.visibilityState === 'hidden') {
      //   this.lostFocusCount++;
      //   this.updateLostFocus()
      //   this.alertService.showWarning(`Tab change detected.`)
      // }
    })
  }

  updateLostFocus() {
    this.challengeSessionService.updateLostFocus(this.id).subscribe({
      next: (res) => {
        this.lostFocusCount = res.lostFocus
        if (this.lostFocusCount == 3) {
          this.alertService.showWarning(`Warning exceeded. Test will auto submit in 5 seconds`)
          setTimeout(() => {
            this.terminateChallenge();
          }, 5000);
        }else{
          this.alertService.showWarning(`Tab changed count: ${this.lostFocusCount}`)
        }
      },
      error: (error: any) => {
        console.error('Error updating lost focus:', error.error.message);
      },
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
