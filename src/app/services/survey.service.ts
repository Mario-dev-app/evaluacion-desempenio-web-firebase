import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(
    private http: HttpClient
  ) { }

  findByPeriodAndSociety(year: number, society: string) {
    return this.http.get(`${environment.base_url}/survey/get/by-period/by-society?year=${year}&society=${society}`);
  }
}
