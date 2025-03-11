import { AlertService } from './../../services/alert/alert.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from './../../services/project/project.service';
import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '../../models/interfaces/project.interface';

@Component({
  selector: 'app-project',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  @Input() project: IProject | null = null;
  projectForm!: FormGroup;
  @Output() toggleProjectModal = new EventEmitter();
  @Output() getProjectList = new EventEmitter();
  constructor(private fb: FormBuilder, private projectService: ProjectService, private alertService: AlertService) { }
  ngOnInit() {
    if (this.project) {
      this.projectForm = this.fb.group({
        title: [this.project.title, [Validators.required]],
        skills: [this.project.skills, [Validators.required]],
        projectUrl: [this.project.projectUrl, [Validators.required]],
      })
    } else {
      this.projectForm = this.fb.group({
        title: ['', [Validators.required]],
        skills: ['', [Validators.required]],
        projectUrl: ['', [Validators.required]],
      })
    }
  }
  createProject(projectForm: FormGroup) {
    this.projectService.createProject(projectForm.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess('Project created successfully');
        this.getProjectList.emit()
        this.ontoggleProjectModal();

      },
      error: (error) => {
        this.alertService.showError(error.error.message);
      },
    })
  }

  updateProject(projectForm: FormGroup) {
    if (!this.project) return

    this.projectService.updateProjectById(this.project._id, projectForm.value).subscribe({
      next: (res) => {
        this.alertService.showSuccess('Project updated successfully');
        this.getProjectList.emit()
        this.ontoggleProjectModal();
      },
      error: (error) => {
        console.error('Error updating session:', error);
      },
    })
  }

  resetForm() {
    this.projectForm = this.fb.group({
      title: [''],
      skills: [''],
      projectUrl: [''],
    })
    this.project = null;
  }



  ontoggleProjectModal() {
    this.resetForm()
    this.toggleProjectModal.emit();
  }
}
