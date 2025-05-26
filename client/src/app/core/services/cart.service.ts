import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart-items`;

  constructor(private http: HttpClient) {}

  getCartItems(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
  
  // postCartItem(body: ???): Observable<any> {
  //   return this.http.post(this.apiUrl, body, { responseType: 'text' });
  // }
}
