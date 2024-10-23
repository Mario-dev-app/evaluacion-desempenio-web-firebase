import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/* PRIMENG */
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
/* import { CardModule } from 'primeng/card'; */
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

import { AreaService, AuthService, CompetencyService, UserService, UtilService } from '../../services';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { societies } from '../utils/societies';
import { roles } from '../utils/roles';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    DropdownModule,
    PaginatorModule,
    TableModule,
    /* CardModule, */
    ButtonModule,
    DialogModule,
    ToastModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  items: MenuItem[] | undefined;

  limit = 5;

  skip = 0;

  count = 0;

  users: any;

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 15, value: 15 },
    { label: 20, value: 20 }
  ];

  societies: any;

  roles: any;

  areas: any;

  maybeApprovers: any;

  levels: any;

  visible: boolean = false;

  isApproverDropdownActive: boolean = true;

  isUpdateForm: boolean = false;

  userIdForUpdated!: string;

  withPaginator: boolean = true;

  addUserForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    numDoc: new FormControl('', [Validators.required, Validators.minLength(8)]),
    position: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    society: new FormControl('', [Validators.required]),
    area: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    approver: new FormControl(''),
    competencyLevel: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private areaService: AreaService,
    private utilService: UtilService,
    private competencyService: CompetencyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.societies = societies;
    this.roles = roles;
    this.items = [
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        route: 'home/user',
        command: () => {
          this.router.navigateByUrl('home/user');
        }
      },
      {
        label: 'Periodos y aprobadores',
        icon: 'pi pi-flag',
        routerLink: 'home/config',
        command: () => {
          this.router.navigateByUrl('home/config');
        }
      },
      {
        label: 'Salir',
        icon: 'pi pi-power-off',
        command: () => {
          this.authService.signOut();
        }
      },
    ];

    this.findUsersByPaginator();
    this.findAllActiveAreas();
    this.findAllMaybeApprovers();
    this.findAllCompetencyLevels();
  }

  validateFormat(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  findAllActiveAreas() {
    this.areaService.getAllActiveAreas().subscribe((resp) => {
      this.areas = resp;
    }, (err) => {
      console.log(err);
    });
  }

  findAllMaybeApprovers() {
    this.userService.findAllMaybeApprovers().subscribe((resp) => {
      this.maybeApprovers = resp;
    }, (err) => {
      console.log(err);
    })
  }

  findAllCompetencyLevels() {
    this.competencyService.getAllLevels().subscribe((resp) => {
      this.levels = resp;
    }, (err) => {
      console.log(err);
    })
  }

  findUsersByPaginator() {
    this.userService.findUserByPagination(this.limit, this.skip).subscribe(({ users, count }: any) => {
      if (this.count === 0) {
        this.count = count;
      }

      this.users = users;
    }, (err) => {
      this.utilService.showError(err.error.message);
    });
  }

  onPageChange(event: any) {
    this.skip = event.first;
    this.limit = event.rows;
    this.findUsersByPaginator();
  }

  onLimitChange(event: any) {
    this.findUsersByPaginator();
  }

  getErrorMessage(controlName: string): string {
    const control = this.addUserForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control?.hasError('minlength')) {
      return 'Debe tener al menos 3 caracteres';
    } else if (control?.hasError('email')) {
      return 'Correo electrónico no válido';
    }

    return '';
  }



  registerUser() {
    if (!this.addUserForm.valid) {
      this.addUserForm.markAllAsTouched();
      this.utilService.showWarning('Rellene los campos del formulario correctamente.');
      return;
    }

    let body;

    const firstname = this.addUserForm.controls['firstname'].value?.trim();
    const lastname = this.addUserForm.controls['lastname'].value?.trim();
    const numDoc = this.addUserForm.controls['numDoc'].value;
    const position = this.addUserForm.controls['position'].value;
    const email = this.addUserForm.controls['email'].value;
    const username = this.addUserForm.controls['username'].value?.trim();
    const society = this.addUserForm.controls['society'].value;
    const area = this.addUserForm.controls['area'].value;
    const role = this.addUserForm.controls['role'].value!;
    const approver = this.addUserForm.controls['approver'].value;
    const competencyLevel = this.addUserForm.controls['competencyLevel'].value;

    if (approver?.length === 0 && ['USER', 'BOSS'].includes(role)) {
      this.utilService.showWarning('Debe seleccionar una aprobador.');
      return;
    }

    body = {
      firstname,
      lastname,
      numDoc,
      position,
      email,
      username,
      password: `${society}1234`,
      society,
      area,
      role,
      competencyLevel: Number(competencyLevel)
    };

    if (approver?.length !== 0) {
      body = { ...body, approver: approver };
    }

    if (this.isUpdateForm) {
      this.userService.updateUser(this.userIdForUpdated, body).subscribe((resp) => {
        this.utilService.showSuccess('Registro actualizado correctamente.');
        this.clearForm();
        this.visible = false;
        this.findUsersByPaginator();
        this.findAllMaybeApprovers();
      }, (err) => {
        this.utilService.showError(err.error.message);
      })
    } else {
      this.userService.creteUser(body).subscribe((resp) => {
        this.utilService.showSuccess('Registro realizado correctamente.');
        this.clearForm();
        this.visible = false;
        this.count = 0;
        this.findUsersByPaginator();
        this.findAllMaybeApprovers();
      }, (err) => {
        this.utilService.showError(err.error.message);
      })
    }


  }

  onRoleChange() {
    if (this.addUserForm.controls['role'].value === 'GER') {
      this.isApproverDropdownActive = false;
    } else {
      this.isApproverDropdownActive = true;
    }
  }

  clearForm() {
    this.addUserForm.reset();
    this.addUserForm.controls['society'].setValue('');
    this.addUserForm.controls['area'].setValue('');
    this.addUserForm.controls['role'].setValue('');
    this.addUserForm.controls['approver'].setValue('');
    this.addUserForm.controls['competencyLevel'].setValue('');
  }

  openAddUserModal() {
    this.clearForm();
    this.isUpdateForm = false;
    this.visible = true;
  }

  setUserForUpdate(user: any) {
    this.isUpdateForm = true;
    this.userIdForUpdated = user._id;
    this.addUserForm.controls['firstname'].setValue(user.firstname);
    this.addUserForm.controls['lastname'].setValue(user.lastname);
    this.addUserForm.controls['numDoc'].setValue(user.numDoc);
    this.addUserForm.controls['position'].setValue(user.position);
    this.addUserForm.controls['email'].setValue(user.email);
    this.addUserForm.controls['username'].setValue(user.username);
    this.addUserForm.controls['society'].setValue(user.society);
    this.addUserForm.controls['area'].setValue(user.area);
    this.addUserForm.controls['role'].setValue(user.role);
    if (user.role === 'GER') {
      this.isApproverDropdownActive = false;
    } else {
      this.isApproverDropdownActive = true;
    }
    this.addUserForm.controls['approver'].setValue(user.approver);
    this.addUserForm.controls['competencyLevel'].setValue(user.competencyLevel);
    this.visible = true;

  }

  onSearchByTerm(search: any) {
    if(search.length === 0) {
      this.withPaginator = true;
      this.findUsersByPaginator();
      return;
    } 

    this.withPaginator = false;
    this.userService.findUsersByFilter(search).subscribe((resp: any) => {
      if(resp.length === 0) {
        this.utilService.showWarning('No se encontraron registros con ese término de búsqueda');
        return;
      }
      this.users = resp;
    }, (err) => {
      console.log(err);
      this.utilService.showError(err.error.message);
    });

  }
}
