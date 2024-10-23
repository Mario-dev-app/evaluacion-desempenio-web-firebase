import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { PeriodService, UtilService } from '../../services';

import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { PaginatorModule } from 'primeng/paginator';
import { societies } from '../utils/societies';


@Component({
  selector: 'app-period',
  standalone: true,
  imports: [
    FormsModule,
    NavbarComponent,
    CardModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    InputSwitchModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressBarModule,
    PaginatorModule
  ],
  templateUrl: './period.component.html',
  styleUrl: './period.component.css'
})
export class PeriodComponent implements OnInit {

  years!: string[];

  societies: any;

  customFormChecked: boolean = false;

  isSelectDisabled: boolean = true;

  year: string = '2024';

  society: string = 'MP';

  limit: number = 5;

  skip: number = 0;

  count: number = 0;

  periods: any;

  loading: boolean = false;

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 15, value: 15 },
    { label: 20, value: 20 }
  ];

  constructor(
    private periodService: PeriodService,
    private utilService: UtilService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.societies = societies;
    this.setDefaultYear();
    this.chargePeriods();
  }

  onCustomCheckChange() {
    if (this.customFormChecked) {
      this.setYearsForCustomForm();
    } else {
      this.setDefaultYear();
    }
  }

  chargePeriods() {
    this.periodService.findPeriodByPaginator(this.limit, this.skip).subscribe((resp: any) => {
      if (this.count === 0) {
        this.count = resp.count;
      }
      this.periods = resp.periods;
    }, (err) => {
      this.utilService.showError(err.error.message);
    });
  }

  setDefaultYear() {
    this.isSelectDisabled = true;
    this.years = [];
    const today = new Date();
    this.years.push(today.getFullYear().toString());
  }

  setYearsForCustomForm() {
    const today = new Date();
    let year = today.getFullYear();
    let counter = 0;
    while (counter < 3) {
      year = year + 1;
      this.years.push(year.toString());
      counter++;
    }
    this.isSelectDisabled = false;
  }

  presentConfirmation(accept: Function, reject: Function) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea modificar el estado?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      acceptButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: accept,
      reject: reject
    });
  }

  onChangeActiveSwitch(id: string, active: boolean) {
    const accept = () => {
      this.periodService.updatePeriodById(id, { active }).subscribe((resp) => {
        this.utilService.showSuccess('Estado de periodo actualizado.');
        this.chargePeriods();
      }, (err) => {
        this.utilService.showError(err.error.message);
      })
    };

    const reject = () => {
      this.utilService.showInfo('No se realizó ninguna modificación.');
      this.chargePeriods();
    };
    
    this.presentConfirmation(accept, reject);
  }

  onChangeSurveySwitch(id: string, surveyActive: boolean) { 
    const accept = () => {
      this.periodService.updatePeriodById(id, { surveyActive }).subscribe((resp) => {
        this.utilService.showSuccess('Estado de encuesta modificado.');
        this.chargePeriods();
      }, (err) => {
        this.utilService.showError(err.error.message);
      })
    };

    const reject = () => {
      this.utilService.showInfo('No se realizó ninguna modificación.');
      this.chargePeriods();
    };

    this.presentConfirmation(accept, reject);
  }

  onChangeResultsSwitch(id: string, resultsActive: boolean) {
    const accept = () => {
      this.periodService.updatePeriodById(id, { resultsActive }).subscribe((resp) => {
        this.utilService.showSuccess('Estado de resultados modificado.');
        this.chargePeriods();
      }, (err) => {
        this.utilService.showError(err.error.message);
      })
    };

    const reject = () => {
      this.utilService.showInfo('No se realizó ninguna modificación.');
      this.chargePeriods();
    };

    this.presentConfirmation(accept, reject);
  }

  createPeriod() {
    this.loading = true;
    this.periodService.createPeriod(this.year, this.society).subscribe((resp) => {
      this.count = 0;
      this.chargePeriods();
      this.loading = false;
      this.utilService.showSuccess('Periodo creado.');
    }, (err) => {
      this.loading = false;
      this.utilService.showError(err.error.message);
    });
  }

  onLimitChange(event: any) {
    this.limit = event;
    this.chargePeriods();
  }

  onPageChange(event: any) {
    this.skip = event.first;
    this.limit = event.rows;
    this.chargePeriods();
  }

  deletePeriod(id: string) {
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
        this.periodService.deletePeriod(id).subscribe((resp) => {
          this.count = 0;
          this.chargePeriods();
          this.utilService.showSuccess('Periodo eliminado.');
        }, (err) => {
          this.utilService.showError(err.error.message);
        })
      },
      reject: () => {
        this.utilService.showInfo('No se realizó ninguna modificación.');
      }
    });
  }

}
