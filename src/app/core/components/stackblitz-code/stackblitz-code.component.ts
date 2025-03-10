import { HttpClient } from '@angular/common/http';
import { Component, Input, } from '@angular/core';
import StackBlitzSDK from '@stackblitz/sdk';
import { ChallengeSessionService } from '../../services/challengeSession/challenge-session.service';
import { AlertService } from '../../services/alert/alert.service';
import { IchallengeSession } from '../../models/interfaces/challengeSession.interface';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stackblitz-code',
  imports: [CommonModule],
  templateUrl: './stackblitz-code.component.html',
  styleUrl: './stackblitz-code.component.css'
})
export class StackblitzCodeComponent {
  projectId!: string;
  stackblitzEditor: any;
  projectSnapshot: any;
  id: string = ''
  challengeSession!: IchallengeSession;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private challengeSessionService: ChallengeSessionService, private alertService: AlertService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getChallengeSessionById()
      }
    });

  }

  getChallengeSessionById() {
    this.challengeSessionService.getChallengeSessionById(this.id).subscribe({
      next: (res: any) => {
        this.challengeSession = res;
        this.projectId = this.extractProjectId(this.challengeSession.stackBlitzUrl);
        this.embedProject();

      },
      error: (error: any) => {
        console.error('Error fetching challenge:', error.error.message);
      },
    });
  }



  // Extract the Project ID from the URL
  extractProjectId(url: string): string {
    const match = url.match(/stackblitz\.com\/edit\/([\w-]+)/);
    return match ? match[1] : '';
  }

  // Embed StackBlitz project using SDK
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
    }
    else {
      console.log("No saved snapshot found. Embedding from projectId...");
      StackBlitzSDK.embedProjectId('stackblitzContainer', this.projectId, {
        height: 600,
        width: '100%',
        hideExplorer: false,
        openFile: 'index.js',
      }).then(editor => {
        this.stackblitzEditor = editor;
      });
    }
  }


  // Save the project changes
  saveProject() {
    if (this.stackblitzEditor) {
      this.stackblitzEditor.getFsSnapshot().then((snapshot: any) => {
        this.projectSnapshot = snapshot;
        this.challengeSessionService.updateChallengeSessionById(this.challengeSession._id, { projectSnapshot: this.projectSnapshot }).subscribe({
          next: () => {
            this.alertService.showSuccess('Code saved.')
          },
          error: (error: any) => {
            this.alertService.showError('Error saving Code.')
          }
        });
      });
    }
  }

}
