import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilesCrudService {
  private apiUrl = environment.apiBaseUrl + '/Beneficiaries'; 
  private beneficiaries$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadBeneficiaries();
  }

  /** ✅ Fetch Beneficiaries for clientId = 1 */
  private loadBeneficiaries(): void {
    console.log("Fetching beneficiaries..."); // Debugging log
  
    this.http.get<any>(this.apiUrl).pipe(
      tap(response => console.log("Fetched Beneficiaries:", response)), // Log API response
      map(response => {
        if (response && response.$values && Array.isArray(response.$values)) {
          return response.$values; // ✅ Extract correct array
        } else {
          console.warn("Unexpected response format:", response);
          return [];
        }
      }),
      catchError((err) => {
        console.error('Error fetching beneficiaries:', err);
        return throwError(() => err);
      })
    ).subscribe((data) => {
      this.beneficiaries$.next(data); // ✅ Store extracted beneficiaries
    });
  }
  

  /** ✅ Get All Beneficiaries */
  getAll(): Observable<any[]> {
    return this.beneficiaries$.asObservable();
  }

  /** ✅ Get Beneficiary by ID */
  getByFileId(beneficiaryId: number): Observable<any> {
    console.log(`Fetching Beneficiary ID: ${beneficiaryId}`);
    return this.http.get<any>(`${this.apiUrl}/${beneficiaryId}`).pipe(
      tap(data => console.log("Fetched Beneficiary:", data)),
      catchError((err) => {
        console.error(`Error fetching beneficiary ${beneficiaryId}:`, err);
        return throwError(() => err);
      })
    );
  }

  /** ✅ Add New Beneficiary */
  add(newBeneficiary: any): Observable<any> {
    console.log("Adding Beneficiary:", newBeneficiary);
    return this.http.post<any>(this.apiUrl, newBeneficiary).pipe(
      tap(response => {
        console.log("Beneficiary Added:", response);
        this.loadBeneficiaries(); // Refresh the list after adding
      }),
      catchError((err) => {
        console.error('Error adding beneficiary:', err);
        return throwError(() => err);
      })
    );
  }

  /** ✅ Update Beneficiary */
  update(beneficiaryId: number, updatedBeneficiary: any): Observable<any> {
    console.log(`Updating Beneficiary ID: ${beneficiaryId}`, updatedBeneficiary);
    return this.http.post<any>(`${this.apiUrl}/${beneficiaryId}`, updatedBeneficiary).pipe(
      tap(response => {
        console.log("Beneficiary Updated:", response);
        this.loadBeneficiaries(); // Refresh the list after updating
      }),
      catchError((err) => {
        console.error(`Error updating beneficiary ${beneficiaryId}:`, err);
        return throwError(() => err);
      })
    );
  }

  /** ✅ Delete Beneficiary */
  delete(beneficiaryId: number): Observable<any> {
    console.log(`Deleting Beneficiary ID: ${beneficiaryId}`);
    return this.http.delete<any>(`${this.apiUrl}/${beneficiaryId}`).pipe(
      tap(response => {
        console.log("Beneficiary Deleted:", response);
        this.loadBeneficiaries(); 
      }),
      catchError((err) => {
        console.error(`Error deleting beneficiary ${beneficiaryId}:`, err);
        return throwError(() => err);
      })
    );
  }
}
