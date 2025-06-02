import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CheckoutRequest } from '../models/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) {}

  postCheckout(body: CheckoutRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, body);
  }
}
