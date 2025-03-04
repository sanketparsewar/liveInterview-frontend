import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLogged:boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertService: AlertService) { }
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }


  login() {
    this.isLogged=true
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLogged=false
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.alertService.showSuccess('Logged in successfully');
        this.router.navigateByUrl('/interviewer'); //
      },

      error: (error) => {
        this.isLogged=false
        this.alertService.showError(error.error.message);
        console.error(error)
      }
    })
  }

}
