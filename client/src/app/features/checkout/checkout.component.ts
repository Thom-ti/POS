import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CheckoutService } from '../../core/services/checkout.service';
import { CartService } from '../../core/services/cart.service';
import { CheckoutRequest } from '../../core/models/checkout.model';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  private router = inject(Router);

  cartItems = this.cartService.cartItems;

  selectedPaymentMethod: 'cash' | 'card' | 'qr' = 'cash';

  totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  confirmCheckout() {
    const body: CheckoutRequest = {
      paymentMethod: this.selectedPaymentMethod,
      cartItems: this.cartItems().map((item) => ({
        cartItemId: item._id,
        product: item.product._id,
        quantity: item.quantity,
      })),
    };

    this.checkoutService.postCheckout(body).subscribe({
      next: (res) => {
        this.cartService.loadCartItems();
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Checkout error:', err);
      },
    });
  }
}
