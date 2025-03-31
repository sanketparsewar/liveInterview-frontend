import { AlertService } from './../../services/alert/alert.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InterviewSessionService } from '../../services/interviewSession/interview-session.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IinterviewSession } from '../../models/interfaces/interviewSession.interface';
import { InterviewSessionComponent } from '../../modalComponents/interview-session/interview-session.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { AuthService } from '../../services/auth/auth.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-interview-session-table',
  imports: [CommonModule, InterviewSessionComponent, FormsModule, PaginationComponent],
  templateUrl: './interview-session-table.component.html',
  styleUrl: './interview-session-table.component.css',
})
export class InterviewSessionTableComponent implements OnInit,OnDestroy {
  interviewSessionsList: IinterviewSession[] = [];
  isToggleModal: boolean = false;
  isToggleDropdown: boolean = false;
  istoggleCreateInterviewSessionModal: boolean = false;
  interviewerData: any | null = null;
  isLoaded: boolean = false;
  queryParameters: any = {
    sortBy: '',
    search: '',
    limit: 10,
    page: 1,
  }

  totalPages: number = 1;
  totalInterviewSessions: number = 0;
  totalPagesArray: number[] = [];
  currentPage: number = 1;
  searchSubject = new Subject<string>();
private interviewSessionSubscription!:Subscription
  constructor(
    private router: Router,
    private interviewSessionService: InterviewSessionService,
    private alertService: AlertService,
    private authservice: AuthService
  ) {
    this.interviewerData = this.authservice.getDecodedToken()
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.queryParameters.search = searchTerm;
      this.getInterviewSessions();

    });
  }
  ngOnInit() {
    this.getInterviewSessions();
  }

  ngOnDestroy(){
    this.interviewSessionSubscription.unsubscribe();
  }

  search(event: any) {
    this.searchSubject.next(event.target.value);
    this.queryParameters.page = 1;
  }

  sort(event: any) {
    this.queryParameters.sortBy = event.target.value;
    this.getInterviewSessions();
  }


  toggleModal() {
    this.isToggleModal = !this.isToggleModal;
  }
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }

  toggleCreateInterviewSessionModal() {
    this.istoggleCreateInterviewSessionModal =
      !this.istoggleCreateInterviewSessionModal;
  }


  getInterviewSessions() {
    this.isLoaded = true;
    this.interviewSessionSubscription=this.interviewSessionService.getAllInterviewSessions(this.interviewerData._id, this.queryParameters).subscribe({
      next: (res: any) => {
        this.interviewSessionsList = res.interviewSessions;
        this.totalInterviewSessions = res.totalInterviewSessions;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.getTotalPagesArray();
        this.isLoaded = false
      },
      error: (error: any) => {
        this.isLoaded = false;
        this.alertService.showError(error.error.message)
      },
    });
  }

  getTotalPagesArray() {
    this.totalPagesArray = [];
    for (let i = 1; i < this.totalPages + 1; i++) {
      this.totalPagesArray.push(i);
    }
  }


  endSession(id: string) {
    this.alertService.showConfirm('end this session').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.isLoaded = true;
        this.interviewSessionService
          .updateInterviewSessionStatus(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess(
                'Session status updated successfully'
              );
              this.getInterviewSessions();
              this.isLoaded = false
            },
            error: (error: any) => {
              this.isLoaded = false;
              this.alertService.showError(error.error.message);
            },
          });
      }
    });
  }

  deleteInterviewSessionById(id: string) {
    this.alertService.showConfirm('delete this session').then((isConfirmed: any) => {
      if (isConfirmed) {
        this.isLoaded = true;
        this.interviewSessionService
          .deleteInterviewSessionById(id)
          .subscribe({
            next: (res: any) => {
              this.alertService.showSuccess('Session deleted.');
              this.getInterviewSessions();
              this.isLoaded = false
            },
            error: (error: any) => {
              this.isLoaded = false;
              this.alertService.showError(error.error.message);
            },
          });
      }
    });
  }


  candidate(id: string) {
    this.router.navigate(['challenge', id]);
  }
}
