import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert/alert.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }


  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        localStorage.setItem('token', res.token);
        this.alertService.showSuccess('Logged in successfully');
        this.router.navigateByUrl('/interviewer'); //
      },

      error: (error) => {
        this.alertService.showError(error.error.message);
        console.error(error)
      }
    })
  }

}
