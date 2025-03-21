import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report/report.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-report',
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  isLoaded: boolean = false;
  result: any[] = [];
  totalProjects: number = 0
  totalInterviewSessions: number = 0
  totalActiveInterviewSessions: number = 0
  totalChallengeSessions: number = 0

  searchSubject = new Subject<string>();
  queryParameters: any = {
    sortBy: '',
    search: '',
  }
  constructor(private router: Router, private reportService: ReportService) {
    // Listen for search input changes with debounce
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.queryParameters.search = searchTerm;
      console.log(this.queryParameters);
      this.getAllReports();
    });
  }

  ngOnInit() {
    this.getAllReports()
  }

  getAllReports(){
    this.isLoaded = true;
    this.reportService.getAllReports(this.queryParameters).subscribe({
      next: (res: any) => {
        this.result = res.result;
        this.totalInterviewSessions = res.totalInterviewSessions;
        this.totalActiveInterviewSessions = res.totalActiveInterviewSessions;
        this.totalProjects = res.totalProjects;
        this.totalChallengeSessions = res.totalChallengeSessions;
        console.log(this.result)
        this.isLoaded = false;
      },
      error: (error: any) => {
        console.error('Error fetching reports:', error.error.message);
        this.isLoaded = false;
      },
    });
  }


  search(event: any) {
    this.searchSubject.next(event.target.value);
  }

  sort(event: any) {
    this.queryParameters.sortBy=event.target.value;
    this.getAllReports();
  }


  viewCode(id: string) {
    this.router.navigate(['/review-code', id])
  }


  back(){
    history.back();
  }

}
