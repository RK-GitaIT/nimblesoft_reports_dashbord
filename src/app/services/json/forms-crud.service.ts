import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormsCrudService {
 private jsonFilePath = 'assets/froms.json'; 
  private jsonData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    this.loadJson();
  }

  private loadJson(): void {
    this.http.get<any[]>(this.jsonFilePath).subscribe(data => {
      this.jsonData$.next(data);
    });
  }

  getAll(): Observable<any[]> {
    return this.jsonData$.asObservable();
  }

  getByFileId(fileId: number): Observable<any[]> {
    return this.jsonData$.pipe(
      map(data => data.filter(item => item['file-id'] === fileId))
    );
  }

  add(newItem: any): void {
    const currentData = this.jsonData$.value;
    newItem.id = currentData.length + 1;
    const updatedData = [...currentData, newItem];
    this.saveJson(updatedData);
  }

  update(id: number, updatedItem: any): void {
    const currentData = this.jsonData$.value;
    const index = currentData.findIndex(item => item.id === id);
    if (index !== -1) {
      currentData[index] = { ...currentData[index], ...updatedItem };
      this.saveJson(currentData);
    }
  }

  delete(id: number): void {
    const updatedData = this.jsonData$.value.filter(item => item.id !== id);
    this.saveJson(updatedData);
  }

  private saveJson(updatedData: any[]): void {
    this.jsonData$.next(updatedData);
    console.warn('⚠️ JSON updates won’t persist in a browser-only environment.');
  }
}
