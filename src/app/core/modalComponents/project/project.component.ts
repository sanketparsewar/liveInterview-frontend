import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  project: any;
  @Output() toggleProjectModal = new EventEmitter();
  constructor() {}

  createProject() {
    console.log('Creating session:', this.project);
    this.ontoggleProjectModal();
  }

  ontoggleProjectModal() {
    this.toggleProjectModal.emit(false);
  }
}
