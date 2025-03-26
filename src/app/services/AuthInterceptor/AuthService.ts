import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from '../toast.service';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(this.hasToken());
  authState$ = this.authSubject.asObservable();
  private apiUrl = environment.apiBaseUrl + '/auth'; 

  constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {}

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.apiUrl + '/login', { email, password }).pipe(
      map(response => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          this.authSubject.next(true);
          this.toastService.showToast('Login Successful', 'Redirecting...', 'success');
        }
        return response;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.authSubject.next(false);
   // this.toastService.showToast('Logged Out', 'Session ended.', 'warning');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authSubject.value;
  }

  resetPassword(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, password });
  }
  
}
