import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/AuthInterceptor/AuthService';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loading: boolean = false;

  isResetPassword: boolean = false; 
  resetEmail: string = '';
  resetPassword: string = '';

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  private passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9]).{8,}$/;

  login() {
    if (!this.passwordRegex.test(this.password)) {
      this.toastService.showToast(
        'Error',
        'Password must be at least 8 characters long, contain one special character, and one number.',
        'error'
      );
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-profile']);
      },
      error: (err) => {
        console.error('Login Error:', err);
        this.loading = false;
        let errorMessage = err.error?.message || 'Invalid credentials';
        this.toastService.showToast('Login Failed', errorMessage, 'error');
      }
    });
  }

  toggleResetPassword(event: Event) {
    event.preventDefault();  // Prevents unwanted page reloads or resets
    this.isResetPassword = !this.isResetPassword;
    this.resetEmail = '';
    this.resetPassword = '';
  }

  sendResetPassword() {
    if (!this.resetEmail || !this.resetPassword) {
      this.toastService.showToast('Error', 'Please enter your email and new password', 'error');
      return;
    }

    if (!this.passwordRegex.test(this.resetPassword)) {
      this.toastService.showToast(
        'Error',
        'Password must be at least 8 characters long, contain one special character, and one number.',
        'error'
      );
      return;
    }

    this.authService.resetPassword(this.resetEmail, this.resetPassword).subscribe({
      next: () => {
        this.toastService.showToast('Success', 'Password reset successful', 'success');
        this.isResetPassword = false; // Close the popup after success
      },
      error: (error) => {
        console.error('Reset Password Error:', error);
        this.toastService.showToast('Error', error.error, 'error');
      }
    });
  }
}
