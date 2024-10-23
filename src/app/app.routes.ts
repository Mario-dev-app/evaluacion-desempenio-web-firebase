import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { UserComponent } from './pages/user/user.component';
import { PeriodComponent } from './pages/period/period.component';
import { CompetencyComponent } from './pages/competency/competency.component';
import { ReportComponent } from './pages/report-surveys/report.component';
import { ReportProgressComponent } from './pages/report-progress/report-progress.component';
import { FilesComponent } from './pages/files/files.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [isLoggedGuard] },
    { path: 'user', component: UserComponent, canActivate: [isLoggedGuard] },
    { path: 'period', component: PeriodComponent, canActivate: [isLoggedGuard] },
    { path: 'competency', component: CompetencyComponent, canActivate: [isLoggedGuard] },
    { path: 'report-survey', component: ReportComponent, canActivate: [isLoggedGuard] },
    { path: 'report-progress', component: ReportProgressComponent, canActivate: [isLoggedGuard] },
    { path: 'files', component: FilesComponent, canActivate: [isLoggedGuard] },
    { path: '**', pathMatch: 'full', redirectTo: 'login' }
];
