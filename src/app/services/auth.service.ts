import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: boolean = false;

  token?: string;

  user?: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signIn(username: string, password: string) {
    return this.http.post(`${environment.base_url}/auth/login`, { username, password });
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = undefined;
    this.user = undefined;
    this.isLogged = false;
    this.router.navigateByUrl('login');
  }
}
