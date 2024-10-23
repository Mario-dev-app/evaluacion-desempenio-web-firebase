import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { PeriodService, UtilService } from '../../services';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-report-progress',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    MenuModule,
    ToastModule,
    RadioButtonModule,
    ButtonModule,
    TabViewModule
  ],
  templateUrl: './report-progress.component.html',
  styleUrl: './report-progress.component.css'
})
export class ReportProgressComponent {

  items: MenuItem[] | undefined = [];

  filter!: string;

  constructor(
    private periodService: PeriodService,
    private utilService: UtilService
  ) {}

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
            this.changePeriod(year, 'MP');
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

  changePeriod(year: number, society: string) {
    console.log(year, society);
  }


}
