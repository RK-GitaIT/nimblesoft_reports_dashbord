import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { QrcodegeneratorComponent } from './component/qrcodegenerator/qrcodegenerator.component';
import { PdfFormsComponent } from './component/pdf/pdf-forms/pdf-forms.component';
import { ProfileComponent } from './component/profile/profile.component';
import { MyProfileComponent } from './component/my-profile/my-profile.component';
import { MyfilesComponent } from './component/myfiles/myfiles.component';

export const routes: Routes = [
  { path: 'family-other', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'qrgenerator', component: QrcodegeneratorComponent },
  { path: 'pdf-forms', component: PdfFormsComponent },
  { path: 'my-files', component: MyfilesComponent },
  { path: '', component: QrcodegeneratorComponent},
  // Changed from {pdf-forms/{mpa-form}} to a route parameter.
  { path: 'pdf-forms/:formType', component: PdfFormsComponent },
  { path: '', redirectTo: '/qrgenerator', pathMatch: 'full' },
  {path:'my-profile', component:MyProfileComponent}
];
