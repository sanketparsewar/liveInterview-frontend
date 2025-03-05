import { AlertService } from './../../core/services/alert/alert.service';
import { ProjectService } from './../../core/services/project/project.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChallengeSessionService } from '../../core/services/challengeSession/challenge-session.service';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from '../../core/modalComponents/project/project.component';
import { IProject } from '../../core/models/interfaces/project.interface';
import { IchallengeSession } from '../../core/models/interfaces/challengeSession.interface';
import { io } from 'socket.io-client';
import { environment } from '../../../environment/environment.prod';
import { InterviewSessionService } from '../../core/services/interviewSession/interview-session.service';
import { IinterviewSession } from '../../core/models/interfaces/interviewSession.interface';
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

  challengeForm!: FormGroup;
  id: string = '';
  challenges: IchallengeSession[] = [];
  projectList: IProject[] = [];
  isToggleProjectModal: boolean = false;
  project:IProject | null=null;
  interviewSession!:IinterviewSession;
  scores: string[] = ["Not Attempted", "Partial Solution", "Completed", "Outstanding"];
  private socket: any;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private projectService: ProjectService,
    private alertService: AlertService,
    private interviewSessionService:InterviewSessionService
  ) {
    // connection
    this.socket = io(environment.SOCKET_URL); 

  }
  ngOnInit() {
    this.getProjectList();
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getInterviewSessionById();
        this.getAllChallenges();
        this.challengeForm = this.fb.group({
          name: ['', [Validators.required]],
          stackBlitzUrl: ['', [Validators.required]],
          interviewSessionId: [this.id],
        });
      }
    });

    // listening for the events made by candidate
    this.socket.on("challengeStarted", () => {
      this.alertService.showSuccess(`Challenge started by candidate.`);
      this.getAllChallenges(); // Refresh challenge list
    });

    this.socket.on("challengeEnded", () => {
      this.alertService.showSuccess(`Challenge ended.`);
      this.getAllChallenges(); // Refresh challenge list
    })
  }

  toggleProjectModal() {
    this.project=null
    this.isToggleProjectModal = !this.isToggleProjectModal;
  }

  getInterviewSessionById(){
    this.interviewSessionService.getInterviewSessionById(this.id).subscribe({
      next: (res: any) => {
        this.interviewSession = res;
      },
      error: (error: any) => {
        console.error('Error fetching interview session:', error.error.message);
      },
    })
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

  edit(item:IProject){
    // console.log(item)
    this.project=item
    this.isToggleProjectModal = !this.isToggleProjectModal;
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

  // startChallenge(id: string) {
  //   this.challengeSessionService.startChallenge(id).subscribe({
  //     next: (res) => {
  //       this.alertService.showSuccess('Challenge started!')
  //       this.getAllChallenges();
  //     },
  //     error: (error: any) => {
  //       this.alertService.showError('Error starting challenge')
  //       // console.error(
  //       //   'Error updating challenge session status:',
  //       //   error.error.message
  //       // );
  //     },
  //   });
  // }

  endChallenge(id: string) {
    this.alertService.showConfirm('End this challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.updateChallengeSessionStatus(id).subscribe({
          next: (res) => {
            // emit the end challenge
            this.socket.emit("endChallenge");
            this.alertService.showSuccess('Challenge Ended!')
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
    });

  }

  updateScore(id: string, score: string) {
    this.alertService.showConfirm(`update score to ${score}`).then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.updateChallengeSessionById(id, score).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Challenge score updated.')
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
