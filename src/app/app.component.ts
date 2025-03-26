import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToastNotificationComponent } from './component/toast-notification/toast-notification.component';
import { AuthService } from './services/AuthInterceptor/AuthService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, ToastNotificationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'telnyx_dashboard';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.authService.logout();  // ✅ Auto logout when redirected to login
        }
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
