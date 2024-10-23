import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(
    private http: HttpClient
  ) { }

  getAllActiveAreas() {
    return this.http.get(`${environment.base_url}/area`);
  }
}
