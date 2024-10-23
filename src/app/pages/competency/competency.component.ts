import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CompetencyService, UtilService } from '../../services';

/* import { CardModule } from 'primeng/card'; */
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-competency',
  standalone: true,
  imports: [
    NavbarComponent,
    /* CardModule, */
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './competency.component.html',
  styleUrl: './competency.component.css'
})
export class CompetencyComponent implements OnInit{

  @ViewChild('copyFrom') copyFrom!: ElementRef;

  competencies: any;

  maxColumnsCompetencies: any;

  visible: boolean = false;

  levelsAvailable: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  existingLevels: number[] = [];

  competenciesForRegister: string[] = [];

  competencyInput: string= '';

  level: string = '';

  constructor(
    private competencyService: CompetencyService,
    private utilService: UtilService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.chargeAllCompetencies();
  }

  chargeAllCompetencies() {
    this.competencyService.getAllCompetencies().subscribe((resp: any) => {
      this.competencies = resp;
      if(resp.length !== 0) {
        this.maxColumnsCompetencies = resp[0].grouping;
        resp.forEach((reg: any, i: number) => {
          if(this.levelsAvailable.includes(reg.level)) {
            this.levelsAvailable.splice(this.levelsAvailable.indexOf(reg.level), 1);
            this.existingLevels.push(reg.level);
          }
        });
      }
    }, (err) => {
      this.utilService.showError(err.error.message);
    });
  }
  
  showDialog() {
    this.visible = !this.visible;
  }

  addCompetency() {
    if(this.competencyInput.length === 0) {
      this.utilService.showWarning('Insertar una competencia válida');
      return;
    }

    this.competenciesForRegister.push(this.competencyInput.trim());
    this.competencyInput = '';
  }

  onCopyFromChange(event: any) {

    if(event.target.value.length === 0) {
      this.competenciesForRegister = [];
    }else {
      this.competencies.forEach((competency: any) => {
        if(competency.level === Number(event.target.value)) {
          this.competenciesForRegister = [...competency.grouping];
        }
      });
    }
  }

  saveCompetency() {

    if(this.level === '') {
      this.utilService.showWarning('No hay nivel seleccionado');
      return;
    }

    if(this.competenciesForRegister.length === 0) {
      this.utilService.showWarning('No hay competencias para registrar');
      return;
    }    
    
    if(this.competencies.length === 0 && this.level !== '1') {
      this.utilService.showWarning('Las competencias deben iniciar desde el nivel 1');
      return;
    }

    /* if(this.competenciesForRegister.length <= this.competencies[0]?.grouping.length) {
      this.utilService.showWarning(`El nivel ${this.level} no puede tener menos competencias que el nivel ${this.competencies[0].level}`);
      return;
    } */
    
    

    if(this.competencies.length > 0 && this.competencies[0].level + 1 !== Number(this.level)) {
      this.utilService.showWarning('El nivel de las competencias deben ser consecutivas');
      return;
    }


    const body = {
      level: Number(this.level),
      label: `Nivel ${this.level}`,
      grouping: this.competenciesForRegister
    }

    
    this.competencyService.createCompetenciesGroup(body).subscribe((resp) => {
      this.level = '';
      this.competenciesForRegister = [];
      this.copyFrom.nativeElement.value = '';
      this.visible = false;
      this.utilService.showSuccess('Competencias registrada correctamente.');
      this.chargeAllCompetencies();
    }, (err) => {
      this.utilService.showError(err.error.message);
    })

  }

  deleteCompetencies(id: string) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar las competencias?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Sí',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      acceptButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        this.competencyService.deleteCompetency(id).subscribe((resp) => {
          this.competencies = undefined;
          this.levelsAvailable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
          this.existingLevels = [];
          this.chargeAllCompetencies();
          this.utilService.showSuccess('Competencias eliminadas.');
        }, (err) => {
          this.utilService.showError(err.error.message);
        });
      },
      reject: () => {
        this.utilService.showInfo('No se realizó ninguna modificación.');
      }
    });
  }

  removeCompetencyFromArr(competencyToRemove: any) {
    const competencieFiltered = this.competenciesForRegister.filter((competency) => {
      return competency !== competencyToRemove;
    });
    this.competenciesForRegister = competencieFiltered;
  }
}
