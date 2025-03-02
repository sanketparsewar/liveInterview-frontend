import { AlertService } from './../../services/alert/alert.service';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from './../../services/project/project.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  projectForm!:FormGroup;
  @Output() toggleProjectModal = new EventEmitter();
  @Output() getProjectList = new EventEmitter();
  constructor(private fb:FormBuilder,private projectService:ProjectService,private alertService:AlertService) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required]],
      skills:['', [Validators.required]],
      projectUrl:['', [Validators.required]],
    })
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
        // console.error('Error creating session:', error);
      },
    })
  }


  ontoggleProjectModal() {
    this.toggleProjectModal.emit(false);
  }
}
