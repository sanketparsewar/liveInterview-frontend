import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_URL = environment.AUTH_URL;
  constructor(private http: HttpClient) { }

  getDecodedToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  login(loginData: any) {
    return this.http.post(`${this.AUTH_URL}/auth/login`, { email: loginData.email, password: loginData.password, skipCaptcha: true });
  }
  getLoggedInterviewer() {
    return JSON.parse(localStorage.getItem('user') || '');
  }
}
