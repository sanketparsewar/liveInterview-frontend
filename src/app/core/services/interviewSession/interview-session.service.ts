import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IinterviewSession } from '../../models/interfaces/interviewSession.interface';

@Injectable({
  providedIn: 'root',
})
export class InterviewSessionService {
  private BASE_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  createInterviewSession(session: IinterviewSession): Observable<IinterviewSession> {
    return this.http.post<IinterviewSession>(`${this.BASE_URL}/interviewsession`, session);
  }

  getAllInterviewSessions(interviewer: string, queryParameters: any): Observable<IinterviewSession[]> {
    let params = new HttpParams().set('interviewer', interviewer);
    // Assign each query parameter separately
    Object.keys(queryParameters).forEach((key) => {
      if (queryParameters[key]) {
        params = params.set(key, queryParameters[key]);
      }
    });

    return this.http.get<IinterviewSession[]>(`${this.BASE_URL}/interviewsession`, { params });
  }

  getInterviewSessionById(id: string): Observable<IinterviewSession> {
    return this.http.get<IinterviewSession>(`${this.BASE_URL}/interviewsession/${id}`);
  }
  updateInterviewSessionStatus(id: string): Observable<IinterviewSession> {
    return this.http.put<IinterviewSession>(`${this.BASE_URL}/interviewsession/sessionstatus/${id}`, {});
  }
  updateInterviewSessionById(id: string): Observable<IinterviewSession> {
    return this.http.put<any>(`${this.BASE_URL}/interviewsession/${id}`, {});
  }
  deleteInterviewSessionById(id: string): Observable<IinterviewSession> {
    return this.http.delete<IinterviewSession>(`${this.BASE_URL}/interviewsession/${id}`);
  }
}
