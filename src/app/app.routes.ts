import { Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { QrcodegeneratorComponent } from './component/qrcodegenerator/qrcodegenerator.component';
import { PdfFormsComponent } from './component/pdf/pdf-forms/pdf-forms.component';
import { ProfileComponent } from './component/profile/profile.component';
import { MyProfileComponent } from './component/my-profile/my-profile.component';
import { MyfilesComponent } from './component/myfiles/myfiles.component';
import { HealthcareComponent } from './component/smart-services/healthcare/healthcare.component';
import { PropertyGuardianshipComponent } from './component/smart-services/property-guardianship/property-guardianship.component';
import { LastWillLivingTrustComponent } from './component/smart-services/last-will-living-trust/last-will-living-trust.component';

export const routes: Routes = [
  { path: 'family-other', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'qrgenerator', component: QrcodegeneratorComponent },
  { path: 'pdf-forms', component: PdfFormsComponent },
  { path: 'health-care', component: HealthcareComponent },
  { path: 'my-files', component: MyfilesComponent },
  { path: '', component: QrcodegeneratorComponent},
  // Changed from {pdf-forms/{mpa-form}} to a route parameter.
  { path: 'pdf-forms/:formType', component: PdfFormsComponent },
  { path: '', redirectTo: '/qrgenerator', pathMatch: 'full' },
  {path:'my-profile', component:MyProfileComponent},
  {path:'last-will',component:PropertyGuardianshipComponent},
  {path:'last-will-living-trust',component:LastWillLivingTrustComponent}
];
