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
import { AnimalCareComponent } from './component/smart-services/animal-care/animal-care.component';
import { FinancesComponent } from './component/smart-services/finances/finances.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './services/AuthInterceptor/AuthGuard';
import { RedirectComponent } from './RedirectComponent';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'family-other', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'qrgenerator', component: QrcodegeneratorComponent, canActivate: [AuthGuard] },
  { path: 'pdf-forms', component: PdfFormsComponent, canActivate: [AuthGuard] },
  { path: 'health-care', component: HealthcareComponent, canActivate: [AuthGuard] },
  { path: 'my-files', component: MyfilesComponent, canActivate: [AuthGuard] },
  { path: 'pdf-forms/:formType', component: PdfFormsComponent, canActivate: [AuthGuard] },
  { path: 'last-will', component: PropertyGuardianshipComponent, canActivate: [AuthGuard] },
  { path: 'last-will-living-trust', component: LastWillLivingTrustComponent, canActivate: [AuthGuard] },
  { path: 'animal-care', component: AnimalCareComponent, canActivate: [AuthGuard] },
  { path: 'finances', component: FinancesComponent, canActivate: [AuthGuard] },

  // ✅ Instead of using redirectTo, we use a component that handles authentication
  { path: '', component: RedirectComponent },

  // ✅ Wildcard route for unauthenticated users (handles incorrect URLs)
  { path: '**', redirectTo: '/login' }
];
