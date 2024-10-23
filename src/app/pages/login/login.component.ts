import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/* PRIMENG */
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';

/* SERVICES */
import { AuthService, UtilService } from '../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DividerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    ProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading: boolean = false;

  constructor(
    private utilService: UtilService,
    private authService: AuthService,
    private router: Router
  ) { }

  showPass: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  signIn() {
    this.loading = true;
    if (!this.loginForm.valid) {
      this.utilService.showWarning('Complete all the inputs.');
      this.loading = false;
      return;
    }
    
    let username = this.loginForm.controls['username'].value!.trim();
    let password = this.loginForm.controls['password'].value!.trim();
    
    this.authService.signIn(username, password).subscribe(({token, user}: any) => {
      if(user.role !== 'ADMIN') {
        this.utilService.showWarning('Role is not valid.')
        this.loading = false;
        return;
      }
      
      this.loading = false;
      this.authService.token = token;
      this.authService.user = user;
      this.authService.isLogged = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.loginForm.reset();
      this.router.navigateByUrl('user');
    }, (err) => {
      this.loading = false;
      console.log(err);
      this.utilService.showError(err.error.message);
    })
  }
}
