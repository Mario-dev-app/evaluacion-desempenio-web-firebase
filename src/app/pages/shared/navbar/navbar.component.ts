import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.items = [
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigateByUrl('user');
        }
      },
      {
        label: 'Periodos',
        icon: 'pi pi-flag',
        command: () => {
          this.router.navigateByUrl('period');
        }
      },
      {
        label: 'Competencias',
        icon: 'pi pi-objects-column',
        command: () => {
          this.router.navigateByUrl('competency');
        }
      },
      {
        label: 'Rpt. Encuestas',
        icon: 'pi pi-chart-bar',
        command: () => {
          this.router.navigateByUrl('report-survey');
        }
      },
      /* {
        label: 'Rpt. Avance',
        icon: 'pi pi-chart-line',
        command: () => {
          this.router.navigateByUrl('report-progress');
        }
      }, */
      {
        label: 'Archivos',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.router.navigateByUrl('files');
        }
      },
      {
        label: 'Salir',
        icon: 'pi pi-power-off',
        command: () => {
          this.authService.signOut();
        }
      },
    ]
  }

}
