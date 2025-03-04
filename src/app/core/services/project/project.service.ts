import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProject } from '../../models/interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private BASE_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  createProject(project: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/project`, project);
  }
  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/project`);
  }
  getProjectById(id: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/project/${id}`);
  }
  updateProjectById(id: string, project: IProject): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/project/${id}`, project);
  } 
  deleteProjectById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/project/${id}`);
  }
}
