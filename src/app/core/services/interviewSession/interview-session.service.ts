import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InterviewSessionService {
  private BASE_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  createInterviewSession(session: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/interviewsession`, session);
  }

  getAllInterviewSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/interviewsession`);
  }

  getInterviewSessionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/interviewsession/${id}`);
  }
  updateInterviewSessionStatus(id: string): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/interviewsession/sessionstatus/${id}`, {});
  }
  updateInterviewSessionById(id: string): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/interviewsession/${id}`, {});
  }
  deleteInterviewSessionById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/interviewsession/${id}`);
  }
}
