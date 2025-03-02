import { InterviewSessionTableComponent } from './../../core/components/interview-session-table/interview-session-table.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interviewer',
  imports: [CommonModule, InterviewSessionTableComponent],
  templateUrl: './interviewer.component.html',
  styleUrl: './interviewer.component.css',
})
export class InterviewerComponent implements OnInit {
  isToggleDropdown: boolean = false;

  constructor() {}
  ngOnInit() {}
  toggleDropdown() {
    this.isToggleDropdown = !this.isToggleDropdown;
  }
}
