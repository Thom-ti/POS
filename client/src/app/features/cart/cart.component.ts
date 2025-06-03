import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  cartItems = this.cartService.cartItems;

  totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  constructor() {
    this.cartService.loadCartItems().subscribe({
      error: (err) => {
        const msg = err?.error?.message || 'โหลดสินค้าในตะกร้าล้มเหลว';
        this.toastr.error(msg);
      },
    });
  }
}
