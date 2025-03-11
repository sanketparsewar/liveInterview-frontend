import { Component, OnInit } from '@angular/core';
import { IProject } from '../../core/models/interfaces/project.interface';
import { ProjectService } from '../../core/services/project/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../core/services/alert/alert.service';
import { ProjectComponent } from '../../core/modalComponents/project/project.component';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule, ProjectComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projectList: IProject[] = [];
  project: IProject | null = null;
  isToggleProjectModal: boolean = false;
  isLoaded: boolean = false;

  constructor(private projectService: ProjectService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProjectList()
  }


  toggleProjectModal() {
    this.project = null
    this.isToggleProjectModal = !this.isToggleProjectModal;
  }


  getProjectList() {
    this.isLoaded = true;
    this.projectService.getAllProjects().subscribe({
      next: (res: any) => {
        this.projectList = res;
        this.isLoaded = false;
      },
      error: (error: any) => {
        this.alertService.showError(error.error.message);
        this.isLoaded = false;
      },
    });
  }

  edit(item: IProject) {
    this.project = item
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
          },
        });
      }
    });
  }

}
