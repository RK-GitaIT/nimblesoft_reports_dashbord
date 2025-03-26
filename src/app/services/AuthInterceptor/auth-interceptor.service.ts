import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const isFileUpload = req.body instanceof FormData;
  const token = sessionStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
  };

  if (!isFileUpload) {
    headers['Content-Type'] = 'application/json'; 
  }

  const clonedReq = req.clone({ setHeaders: headers });

  return next(clonedReq);
};
