import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environment';
import { error } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class LegalDocumentsService {

  private readonly apiUrl = environment.apiBaseUrl + '/LegalDocuments'; 

  constructor(private http: HttpClient) { }

  getLegalDocuments(
    pageNumber: number = 1,
    pageSize: number = 15,
    sortColumn: string = 'UploadDate',
    ascending: boolean = false
  ): Observable<any | null> {
    
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('ascending', ascending.toString());

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  uploadDocuments(
    files: File[],
    documentName: string,
    documentType: string,
    clientId: number
  ): Observable<any> {
    const formData = new FormData();
  
    files.forEach(file => {
      formData.append('Files', file, file.name);
    });
  
    formData.append('documentName', documentName);
    formData.append('documentType', documentType);
    formData.append('clientId', clientId.toString());
  
    console.log("📤 Uploading files with FormData:");
    formData.forEach((value, key) => console.log(`${key}:`, value));
  
    return this.http.post<any>(this.apiUrl, formData).pipe(
      map(response => {
        console.log("✅ Upload Response:", response);
        return response;
      }),
      catchError(error => {
        console.error("❌ Upload Error:", error);
        return throwError(() => error);
      })
    );
  }
  

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${documentId}`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  updateDocumentFile(documentId: number, file: File, documentName: string, documentType: string): Observable<any> {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('DocumentName', documentName);
    formData.append('DocumentType', documentType);

    return this.http.put<any>(`${this.apiUrl}/${documentId}`, formData).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${documentId}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error(error.message || "Something went wrong"));
  }
}
