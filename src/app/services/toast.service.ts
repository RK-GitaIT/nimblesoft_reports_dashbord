import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Toast {
  message: string;
  subMessage?: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(message: string, subMessage: string = '', type: 'success' | 'error' | 'warning' = 'success', duration: number = 3000) {
    this.toastSubject.next({ message, subMessage, type, duration });

    setTimeout(() => {
      this.toastSubject.next(null); // Hide toast after duration
    }, duration);
  }
}
