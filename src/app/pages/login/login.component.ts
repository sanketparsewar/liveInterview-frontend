import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert/alert.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertService: AlertService) { }
  // userSubject = new BehaviorSubject<any>({});
  // user$ = this.userSubject.asObservable();
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
        localStorage.setItem('user', res.user);
        this.alertService.showSuccess('Logged in successfully');
        this.router.navigateByUrl('/interviewer'); //
        // this.userSubject.next(res.user);
      },

      error: (error) => {
        this.alertService.showError(error.error.message);
        console.error(error)
      }
    })
  }

}
