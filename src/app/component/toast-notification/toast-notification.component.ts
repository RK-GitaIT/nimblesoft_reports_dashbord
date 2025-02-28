import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent {
  toast$;
  constructor(private toastService: ToastService) {
    this.toast$ = this.toastService.toast$; 
  }

  closeToast() {
    this.toastService.showToast('', '', 'success', 0); // Hide toast
  }
}