import { AlertService } from './../../core/services/alert/alert.service';
import { ProjectService } from './../../core/services/project/project.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from '../../core/modalComponents/project/project.component';
import { IProject } from '../../core/models/interfaces/project.interface';
import { IchallengeSession } from '../../core/models/interfaces/challengeSession.interface';

@Component({
  selector: 'app-challenge',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FormsModule,
    ProjectComponent,
  ],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css',
})
export class ChallengeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private projectService: ProjectService,
    private alertService:AlertService
  ) {}
  challengeForm!: FormGroup;
  id: string = '';
  challenges: IchallengeSession[] = [];
  projectList: IProject[] = [];
  isToggleProjectModal: boolean = false;
  scores: string[] = ["Not Attempted", "Partial Solution", "Completed", "Outstanding"];

  ngOnInit() {
    this.getProjectList();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getAllChallenges();
        this.challengeForm = this.fb.group({
          name: [''],
          stackBlitzUrl: [''],
          interviewSessionId: [this.id],
        });
      }
    });
  }

  toggleProjectModal() {
    this.isToggleProjectModal = !this.isToggleProjectModal;
  }

  getAllChallenges() {
    this.challengeSessionService
      .getChallengeSessionsByInterviewId(this.id)
      .subscribe({
        next: (res: any) => {
          this.challenges = res.challengeSessions;
        },
        error: (error: any) => {
          console.error('Error fetching challenges:', error.error.message);
        },
      });
  }

  createChallenge() {
    this.challengeSessionService
      .createChallengeSession(this.challengeForm.value)
      .subscribe({
        next: (res) => {
          this.alertService.showSuccess('Challenge created.');
          this.getAllChallenges();
          this.reset();
        },
        error: (error: any) => {
          this.alertService.showError(error.error.message);
          // console.error('Error creating challenge:', );
        },
      });
  }
  deleteChallenge(id: string) {
    this.alertService.showConfirm('delete the challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.deleteChallengeSessionById(id).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Challenge deleted successfully');
            this.getAllChallenges();
          },
          error: (error: any) => {
            this.alertService.showError('Error deleting challenge');
            // console.error('Error deleting challenge:', error.error.message);
          },
        });
      }
    });  
  }


  getProjectList() {
    this.projectService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projectList = res;
      },
      error: (error: any) => {
        this.alertService.showError(error.error.message);
        // console.error('Error fetching projects:', error.error.message);
      },
    });
  }


  deleteProject(id: string) {
    this.alertService.showConfirm('delete the project').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.projectService.deleteProjectById(id).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Project deleted successfully');
            this.getProjectList();
          },
          error: (error: any) => {
            this.alertService.showError('Error deleting project');
            // console.error('Error deleting project:', error.error.message);
          },
        });
      }
    });    
  }

  copyToClipboard(link: string) {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        this.alertService.showSuccess('Link copied!')
      })
      .catch((err) => {
        this.alertService.showError('Could not copy text')
        // console.error('Could not copy text: ', err);
      });
  }

  startChallenge(id: string) {
    this.challengeSessionService.startChallenge(id).subscribe({
      next: (res) => {
        this.alertService.showSuccess('Challenge started!')
        this.getAllChallenges();
      },
      error: (error: any) => {
        this.alertService.showError('Error starting challenge')
        // console.error(
        //   'Error updating challenge session status:',
        //   error.error.message
        // );
      },
    });
  }
  updateChallengeSessionStatus(id: string) {
    this.challengeSessionService.updateChallengeSessionStatus(id).subscribe({
      next: (res) => {
        this.alertService.showSuccess('Challenge session status updated!')
        this.getAllChallenges();
      },
      error: (error: any) => {
        this.alertService.showError('Error updating challenge session status')
        // console.error(
        //   'Error updating challenge session status:',
        //   error.error.message
        // );
      },
    });
  }

  updateChallengeSessionById(id:string,score:string){
    this.alertService.showConfirm(`update score to ${score}`).then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.updateChallengeSessionById(id,score).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Challenge updated successfully')
            this.getAllChallenges();
          },
          error: (error: any) => {
            this.alertService.showError('Error updating challenge')
            // console.error('Error updating challenge:', error.error.message);
          },
        });
      }
    });   


    
  }


  reset() {
    this.challengeForm = this.fb.group({
      name: [''],
      stackBlitzUrl: [''],
      interviewSessionId: [this.id],
    });
  }
}
