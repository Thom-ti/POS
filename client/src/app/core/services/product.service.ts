import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }

  getProductById(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
