import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findUserByPagination(limit: number, skip: number) {
    return this.http.get(`${environment.base_url}/user?limit=${limit}&skip=${skip}`);
  }

  findAllMaybeApprovers() {
    return this.http.get(`${environment.base_url}/user/app-web/maybe-approvers/all`);
  }

  creteUser(body: any) {
    return this.http.post(`${environment.base_url}/user`, body);
  }

  updateUser(id: string, body: any) {
    return this.http.patch(`${environment.base_url}/user/${id}`, body);
  }

  findUsersByFilter(term: string) {
    return this.http.get(`${environment.base_url}/user/${term}`);
  }
}
