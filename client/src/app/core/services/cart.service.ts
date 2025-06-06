import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart-items`;

  private cartItemsSignal = signal<CartItem[]>([]);
  readonly cartItems = computed(() => this.cartItemsSignal());

  constructor(private http: HttpClient) {}

  // โหลดสินค้าทั้งหมดใน cart (และ set signal)
  loadCartItems(): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(this.apiUrl)
      .pipe(tap((data) => this.cartItemsSignal.set(data)));
  }

  postCartItem(body: {
    product: string;
    quantity: number;
  }): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, body).pipe(
      tap(() => {
        // Reload cart หลังเพิ่มสำเร็จ
        this.loadCartItems().subscribe();
      })
    );
  }

  removeCartItem(id: string): Observable<CartItem> {
    return this.http.delete<CartItem>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadCartItems().subscribe();
      })
    );
  }
}
