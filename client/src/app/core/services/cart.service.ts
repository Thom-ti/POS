import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart-items`;

  private cartItemsSignal = signal<CartItem[]>([]);

  readonly cartItems = computed(() => this.cartItemsSignal());

  constructor(private http: HttpClient) {}

  loadCartItems(): void {
    this.http.get<CartItem[]>(this.apiUrl).subscribe({
      next: (data) => this.cartItemsSignal.set(data),
      error: (err) => console.error('Load cart failed', err),
    });
  }

  postCartItem(body: { product: string; quantity: number }): void {
    this.http.post<CartItem>(this.apiUrl, body).subscribe({
      next: () => this.loadCartItems(), // reload เพื่ออัปเดต signal
      error: (err) => console.error('Add to cart failed', err),
    });
  }
}
