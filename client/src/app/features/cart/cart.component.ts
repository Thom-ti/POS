import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems = '';
  private destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const subscription = this.cartService.getCartItems().subscribe((data) => {
      this.cartItems = data;
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  // addCartItem(): void {}
}
