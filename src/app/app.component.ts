import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToastNotificationComponent } from './component/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, ToastNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'telnyx_dashboard';
}
