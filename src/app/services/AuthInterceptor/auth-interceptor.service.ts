import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const isFileUpload = req.body instanceof FormData;

  const headers: Record<string, string> = {
    Authorization: `Bearer KEY019545FFDF282A75C08A9F6CA4E7BFB7_70MN4UvpyiZ9qSoq2buqO2`,
    Accept: 'application/json'
  };

  if (!isFileUpload) {
    headers['Content-Type'] = 'application/json'; 
  }

  const clonedReq = req.clone({ setHeaders: headers });

  return next(clonedReq);
};
