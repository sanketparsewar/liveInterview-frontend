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
  private peerConnection!: RTCPeerConnection;
  private config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  @ViewChild('candidateVideo') candidateVideo!: ElementRef<HTMLVideoElement>;

  constructor(private challengeSessionService: ChallengeSessionService, private alertService: AlertService) {
    this.socket = io(environment.SOCKET_URL);
  }

  ngOnInit() {
    this.projectId = this.extractProjectId(this.challengeSession.stackBlitzUrl);
    this.embedProject();



    this.setupWebRTC();

    this.socket.on('answer', async (answer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on('ice-candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.emit("requestOffer");
  }



  async setupWebRTC() {
    this.peerConnection = new RTCPeerConnection(this.config);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (this.candidateVideo) {
        this.candidateVideo.nativeElement.srcObject = stream;
      }
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.socket.emit('offer', offer);
    } catch (error) {
      this.alertService.showError('Error accessing webcam')
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };
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
}
