import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'web';

  private authService = inject(AuthService);

  ngOnInit(): void {
    if(localStorage.getItem('token') && localStorage.getItem('user')) {
      this.authService.token = localStorage.getItem('token') || undefined;
      this.authService.user = JSON.parse(localStorage.getItem('user') || '');
      this.authService.isLogged = true;
    }
  }
}
