import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { QrcodegeneratorComponent } from './component/qrcodegenerator/qrcodegenerator.component';
import { PdfFormsComponent } from './component/pdf/pdf-forms/pdf-forms.component';

export const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'qrgenerator', component: QrcodegeneratorComponent },
  { path: 'pdf-forms', component: PdfFormsComponent },
  { path: '', component: QrcodegeneratorComponent},
  // Changed from {pdf-forms/{mpa-form}} to a route parameter.
  { path: 'pdf-forms/:formType', component: PdfFormsComponent },
  { path: '', redirectTo: '/qrgenerator', pathMatch: 'full' }
];
