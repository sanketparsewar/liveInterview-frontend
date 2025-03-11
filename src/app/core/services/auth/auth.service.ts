import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_URL = environment.AUTH_URL;
  constructor(private http: HttpClient) { }

  login(loginData: any) {
    return this.http.post(`${this.AUTH_URL}/auth/login`, { email: loginData.email, password: loginData.password, skipCaptcha: true });
  }
  getLoggedInterviewer() {
    return JSON.parse(localStorage.getItem('user') || '');
  }
}
