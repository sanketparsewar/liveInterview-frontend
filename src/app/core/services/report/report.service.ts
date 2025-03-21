import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private BASE_URL = environment.API_URL;
  constructor(private http: HttpClient) { }


  getAllReports(queryParameters: any): Observable<any[]> {
    let params = new HttpParams();
    // Assign each query parameter separately
    Object.keys(queryParameters).forEach((key) => {
      if (queryParameters[key]) {
        params = params.set(key, queryParameters[key]);
      }
    });
    // return this.http.get<IinterviewSession[]>(`${this.BASE_URL}/interviewsession`, { params });
    return this.http.get<any[]>(`${this.BASE_URL}/report`, { params });
  }
}
