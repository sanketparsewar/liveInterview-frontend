import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = " https://admin.liveexamcenter.in/api";

  constructor(private http: HttpClient) { }

  login(loginData: any) {
    return this.http.post(`${this.BASE_URL}/auth/login`, { email: loginData.email, password: loginData.password, skipCaptcha: true });
  }
  getLoggedInterviewer(){
    // return JSON.parse(localStorage.getItem('user'));
  }
}
