import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {

  constructor(
    private http: HttpClient
  ) { }

  getAllCompetencies() {
    return this.http.get(`${environment.base_url}/competencies`);
  }

  createCompetenciesGroup(body: any) {
    return this.http.post(`${environment.base_url}/competencies`, body);
  }

  deleteCompetency(id: string) {
    return this.http.delete(`${environment.base_url}/competencies/${id}`);
  }

  getAllLevels() {
    return this.http.get(`${environment.base_url}/competencies/levels/all`);
  }
}
