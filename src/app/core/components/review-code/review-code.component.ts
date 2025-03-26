import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import StackBlitzSDK from '@stackblitz/sdk';
import { ChallengeSessionService } from '../../services/challengeSession/challenge-session.service';
import { AlertService } from '../../services/alert/alert.service';
import { IchallengeSession } from '../../models/interfaces/challengeSession.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebCameraComponent } from '../web-camera/web-camera.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../../../../environment/environment.prod';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-review-code',
  imports: [CommonModule, FormsModule, DragDropModule],

  templateUrl: './review-code.component.html',
  styleUrl: './review-code.component.css'
})
export class ReviewCodeComponent implements OnInit {
  projectId!: string;
  stackblitzEditor: any;
  projectSnapshot: any;
  id: string = ''
  challengeSession!: IchallengeSession;
  isLoaded: boolean = false
  private socket!: Socket;
  private peerConnection!: RTCPeerConnection;
  private config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  @ViewChild('interviewerVideo') interviewerVideo!: ElementRef<HTMLVideoElement>;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private challengeSessionService: ChallengeSessionService, private alertService: AlertService) {
    this.socket = io(environment.SOCKET_URL);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChallengeSessionById();
      }
    });

    this.socket.on("codeSaved", () => {
      this.getChallengeSessionById();
    });



    this.setupWebRTC();

    this.socket.on('offer', async (offer) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.socket.emit('answer', answer);
    });

    this.socket.on('ice-candidate', (candidate) => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.socket.emit("requestOffer");
  }

  setupWebRTC() {
    this.peerConnection = new RTCPeerConnection(this.config);

    this.peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (this.interviewerVideo) {
        this.interviewerVideo.nativeElement.srcObject = remoteStream;
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    this.socket.emit("requestOffer");
  }

  getChallengeSessionById() {
    this.isLoaded = true;
    this.challengeSessionService.getChallengeSessionById(this.id).subscribe({
      next: (res: any) => {
        this.challengeSession = res;
        this.projectId = this.extractProjectId(this.challengeSession.stackBlitzUrl);
        this.embedProject();

      },
      error: (error: any) => {
        this.alertService.showError(error.error.message)
        this.isLoaded = false;
      },
    });
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

  back() {
    history.back();
  }
}
