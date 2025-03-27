import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import StackBlitzSDK from '@stackblitz/sdk';
import { ChallengeSessionService } from '../../services/challengeSession/challenge-session.service';
import { AlertService } from '../../services/alert/alert.service';
import { IchallengeSession } from '../../models/interfaces/challengeSession.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../../../../environment/environment.prod';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-review-code',
  imports: [CommonModule, FormsModule, DragDropModule],

  templateUrl: './review-code.component.html',
  styleUrl: './review-code.component.css'
})
export class ReviewCodeComponent implements OnInit, AfterViewInit {
  projectId!: string;
  stackblitzEditor: any;
  projectSnapshot: any;
  id: string = ''
  challengeSession!: IchallengeSession;
  isLoaded: boolean = false
  private socket!: Socket;
  challengeId: string = '';
  isIframeFocused = false;
  peer: any;
  candidateId: string = '';
  isChallengeJoined: boolean = false;

  @ViewChild('canvas') videoElement!: ElementRef<HTMLCanvasElement>;

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

    this.getResponse().subscribe((stream: any) => {
      this.displayImageFrame(stream);
    });

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


  getResponse() {
    return new Observable((observer) => {
      this.socket.on('getStream', (data: string) => {
        observer.next(data);
      });
    });
  }

  ngAfterViewInit() {
    this.getResponse().subscribe((stream: any) => {
      this.displayImageFrame(stream);
    });
  }

  displayImageFrame(frame: string) {
    const canvas = this.videoElement.nativeElement;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = frame;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }

  back() {
    history.back();
  }
}
