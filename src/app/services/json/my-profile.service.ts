import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class myProfileService {
  private apiUrl = environment.apiBaseUrl + '/clients'; 
  private profileData$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  clientId: number =1;
  constructor(private http: HttpClient) {}

  /** ✅ Fetch Profile Data */
  getProfile(): Observable<any | null> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log("Full API Response:", response); // ✅ Debug API response
        return response?.$values?.[0] || null; // ✅ Extract first client
      }),
      catchError(error => {
        console.error("Error fetching profile:", error);
        throw error; // ✅ Rethrow error for debugging
      })
    );
  }

  /** ✅ Update Profile Data */
  updateProfile(updatedProfile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${this.clientId}`, updatedProfile).pipe(
      map(response => {
        console.log("Update API Response:", response); 
        return response;
      }),
      catchError(error => {
        console.error("Error updating profile:", error);
        throw error;
      })
    );
  }
  
}
