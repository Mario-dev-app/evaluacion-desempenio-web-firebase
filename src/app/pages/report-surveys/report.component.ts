import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { PeriodService, SurveyService, UtilService } from '../../services';
import { FormsModule } from '@angular/forms';


import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NavbarComponent,
    MenuModule,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    ToastModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  items: MenuItem[] | undefined = [];

  filter!: string;

  surveys: any;

  isSearchButtonActive: boolean = false;

  activeYear!: number;

  constructor(
    private periodService: PeriodService,
    private surveyService: SurveyService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.getPeriodYears();
  }

  getPeriodYears() {
    this.periodService.findAllDistinctPeriods().subscribe((resp: any) => {
      let myItems: any[] = [];
      resp.forEach((year: any) => {
        myItems.push({
          label: `${year}`,
          icon: 'pi pi-calendar',
          command: () => {
            this.changeSurveysOfPeriod(year, 'MP');
          }
        });
      });
      this.items = [
        {
          label: 'Periodos',
          items: myItems
        }
      ];
    }, (err) => {
      this.utilService.showError(err.error.message);
    });
  }

  changeSurveysOfPeriod(year: number, society: string) {
    this.activeYear = year;
    this.surveyService.findByPeriodAndSociety(year, society).subscribe((resp: any) => {
      if (resp.length === 0) {
        this.utilService.showInfo('No se encontraron registros.');
      }
      this.surveys = resp;
      this.filter = society;
      this.isSearchButtonActive = true;
    }, (err) => {
      this.utilService.showError(err.error.message);
    });
  }

  searchByFilter() {
    this.changeSurveysOfPeriod(this.activeYear, this.filter);
  }

  downloadExcelReport() {
    const url = `${environment.base_url}/survey/download/excel-report?year=${this.activeYear}&society=${this.filter}`;
    window.open(url, '_blank');
  }

}
