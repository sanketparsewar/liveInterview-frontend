import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import StackBlitzSDK from '@stackblitz/sdk';
import { ChallengeSessionService } from '../../services/challengeSession/challenge-session.service';
import { AlertService } from '../../services/alert/alert.service';
import { IchallengeSession } from '../../models/interfaces/challengeSession.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../../../../environment/environment.prod';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-stackblitz-code',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './stackblitz-code.component.html',
  styleUrl: './stackblitz-code.component.css'
})

export class StackblitzCodeComponent implements OnInit {

  @Input() challengeSession!: IchallengeSession;
  projectId!: string;
  stackblitzEditor: any;
  projectSnapshot: any;
  id: string = ''
  isLoaded: boolean = false
  private socket!: Socket;
  @Input() showWebcam: boolean = false;
  @ViewChild('candidateVideo') candidateVideo!: ElementRef<HTMLVideoElement>;
  peer: any;
  stream: any;

  constructor(private challengeSessionService: ChallengeSessionService, private alertService: AlertService) {
    this.socket = io(environment.SOCKET_URL);
  }

  ngOnInit() {
    this.projectId = this.extractProjectId(this.challengeSession.stackBlitzUrl);
    this.embedProject();
    this.startWebcam();
  }

  extractProjectId(url: string): string {
    const match = url.match(/stackblitz\.com\/edit\/([\w-]+)/);
    return match ? match[1] : '';
  }

  embedProject() {
    if (!this.projectId) return;
    if (this.challengeSession.projectSnapshot) {
      const formattedProject = {
        files: this.challengeSession.projectSnapshot,
        title: "Saved Project",
        description: "A restored project from session",
        template: "node" as "node"
      };
      StackBlitzSDK.embedProject('stackblitzContainer', formattedProject, {
        height: 600,
        width: '100%',
        hideExplorer: false,
        openFile: 'index.js',
      }).then(editor => {
        this.stackblitzEditor = editor;
      });
      this.isLoaded = false;

    }
    else {
      StackBlitzSDK.embedProjectId('stackblitzContainer', this.projectId, {
        height: 600,
        width: '100%',
        hideExplorer: false,
        openFile: 'index.js',
      }).then(editor => {
        this.stackblitzEditor = editor;
      });
      this.isLoaded = false;

    }
  }

  saveProject() {
    if (this.stackblitzEditor) {
      this.stackblitzEditor.getFsSnapshot().then((snapshot: any) => {
        this.projectSnapshot = snapshot;
        this.challengeSessionService.updateChallengeSessionById(this.challengeSession._id, { projectSnapshot: this.projectSnapshot }).subscribe({
          next: () => {
            this.alertService.showSuccess('Code saved.')
            this.socket.emit("saveCode");
          },
          error: (error: any) => {
            this.alertService.showError('Error saving Code.')
          }
        });
      });
    }
  }

  startWebcam() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const hasCamera = devices.some((device) => device.kind === 'videoinput');
      if (!hasCamera) {
        this.alertService.showInfo('No camera detected. Please connect a camera.');
        return;
      }
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.sendVideoFrames(stream);
          this.candidateVideo.nativeElement.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    });
  }

  sendVideoFrames(stream: MediaStream) {
    const video = this.candidateVideo?.nativeElement;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sendFrame = () => {
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameData = canvas.toDataURL('image/webp');
      this.socket.emit('stream', {
        challengeId: this.challengeSession._id,
        frame: frameData,
      });
      setTimeout(sendFrame, 33);
    };
    sendFrame();
  }

}
