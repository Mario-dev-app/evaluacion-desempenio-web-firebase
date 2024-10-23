import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor(
    private http: HttpClient
  ) { }

  findPeriodByPaginator(limit: number, skip: number) {
    return this.http.get(`${environment.base_url}/period?limit=${limit}&skip=${skip}`);
  }

  findAllDistinctPeriods() {
    return this.http.get(`${environment.base_url}/period/all/distinct/years`);
  }

  updatePeriodById(id: string, body: any) {
    return this.http.patch(`${environment.base_url}/period/${id}`, body);
  }

  createPeriod(year: string, society: string) {
    return this.http.post(`${environment.base_url}/period`, { year, society });
  }

  deletePeriod(id: string) {
    return this.http.delete(`${environment.base_url}/period/${id}`);
  }
}
