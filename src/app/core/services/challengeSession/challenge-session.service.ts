import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeSessionService {

  private BASE_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  createChallengeSession(session: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/challengesession`, session);
  }

  getAllChallengeSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/challengesession`);
  }

  getChallengeSessionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/challengesession/${id}`);
  }
  updateChallengeSessionStatus(id: string): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/challengesession/sessionstatus/${id}`, {});
  }
  updateChallengeSessionById(id: string): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/challengesession/${id}`, {});
  }
  deleteChallengeSessionById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/challengesession/${id}`);
  }
}
