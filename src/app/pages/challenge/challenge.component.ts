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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  project: IProject | null = null;
  interviewSession!: IinterviewSession;
  scores: string[] = ["Not Attempted", "Partial Solution", "Completed", "Outstanding"];
  private socket: any;
  isLoaded: boolean = false;
  isCreated: boolean = false;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private challengeSessionService: ChallengeSessionService,
    private projectService: ProjectService,
    private alertService: AlertService,
    private interviewSessionService: InterviewSessionService,
    private router: Router,
  ) {
    // connection
    this.socket = io(environment.SOCKET_URL);

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.id = params['id'];
        this.getInterviewSessionById();

        this.challengeForm = this.fb.group({
          name: ['', [Validators.required]],
          stackBlitzUrl: ['', [Validators.required]],
          projectName: ['',[Validators.required]],
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

  onProjectSelect(event: any) {
    const selectedProject = this.projectList.find(item => item.projectUrl === event.target.value);
    if (selectedProject) {
      this.challengeForm.patchValue({
        projectName: selectedProject.title,
      });
    }
  }


  toggleProjectModal() {
    this.project = null
    this.isToggleProjectModal = !this.isToggleProjectModal;
  }

  getInterviewSessionById() {
    this.isLoaded = true;
    this.interviewSessionService.getInterviewSessionById(this.id).subscribe({
      next: (res: any) => {
        this.interviewSession = res;
        if (this.interviewSession.isActive) {
          this.getProjectList()
        }
        this.getAllChallenges();
      },
      error: (error: any) => {
        console.error('Error fetching interview session:', error.error.message);
        this.isLoaded = false;
      },
    })
  }

  getProjectList() {
    this.projectService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projectList = res;
      },
      error: (error: any) => {
        this.alertService.showError(error.error.message);
      },
    });
  }

  getAllChallenges() {
    this.challengeSessionService
      .getChallengeSessionsByInterviewId(this.id)
      .subscribe({
        next: (res: any) => {
          this.challenges = res.challengeSessions;
          this.isLoaded = false;
        },
        error: (error: any) => {
          this.alertService.showError(error.error.message);
          this.isLoaded = false;

        },
      });
  }

  createChallenge() {
    this.isCreated = true;
    this.challengeSessionService
      .createChallengeSession(this.challengeForm.value)
      .subscribe({
        next: (res) => {
          this.alertService.showSuccess('Challenge created.');
          this.getAllChallenges();
          this.isCreated = false;
          this.reset();
        },
        error: (error: any) => {
          this.isCreated = false;
          this.alertService.showError(error.error.message);
        },
      });
  }

  deleteChallenge(id: string) {
    this.alertService.showConfirm('delete this challenge').then((isConfirmed: any) => {
      if (isConfirmed && this.interviewSession.isActive) {
        this.challengeSessionService.deleteChallengeSessionById(id).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Challenge deleted successfully');
            this.getAllChallenges();
          },
          error: (error: any) => {
            this.alertService.showError('Error deleting challenge');
          },
        });
      }
      else if (isConfirmed && !this.interviewSession.isActive) {
        this.alertService.showWarning('Interview completed, can not delete challenge.')
      }
    });
  }


  copyToClipboard(link: string) {
    navigator.clipboard
      .writeText(location.origin + "/candidate/" + link)
      .then(() => {
        this.alertService.showSuccess('Link copied!')
      })
      .catch((err) => {
        this.alertService.showError('Could not copy text')
      });
  }

  endChallenge(id: string) {
    this.alertService.showConfirm('end this challenge').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.updateChallengeSessionStatus(id).subscribe({
          next: (res) => {
            // emit the end challenge
            this.socket.emit("endChallenge");
          },
          error: (error: any) => {
            this.alertService.showError('Error updating challenge session status')
          },
        });
      }
    });
  }

  updateScore(id: string, score: string) {
    this.alertService.showConfirm(`update score to ${score}`).then((isConfirmed: any) => {
      if (isConfirmed) {
        this.challengeSessionService.updateChallengeSessionById(id, { score }).subscribe({
          next: (res) => {
            this.alertService.showSuccess('Challenge score updated.');
            this.getAllChallenges();
          },
          error: (error: any) => {
            this.alertService.showError('Error updating challenge');
          },
        });
      }
    });
  }



  reset() {
    this.challengeForm = this.fb.group({
      name: [''],
      stackBlitzUrl: [''],
      projectName: [''],
      interviewSessionId: [this.id],
    });
  }

  viewCode(id: string) {
    this.router.navigate(['/review-code', id])
  }

  back(){
    history.back();
  }

}
