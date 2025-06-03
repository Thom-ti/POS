import { Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CheckoutService } from '../../core/services/checkout.service';
import { CartService } from '../../core/services/cart.service';
import { CheckoutRequest } from '../../core/models/checkout.model';
import { CartItemComponent } from '../cart/cart-item/cart-item.component';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, FormsModule, CartItemComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  cartItems = this.cartService.cartItems;

  selectedPaymentMethod: 'cash' | 'card' | 'qr' = 'cash';

  totalPrice = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );

  ngOnInit() {
    this.cartService.loadCartItems().subscribe({
      error: (err) => {
        const msg = err?.error?.message || 'โหลดสินค้าในตะกร้าล้มเหลว';
        this.toastr.error(msg);
      },
    });
  }

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
        this.toastr.success('ชำระเงินเรียบร้อย');
        this.cartService.loadCartItems().subscribe();
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const msg = err?.error?.message || 'ชำระเงินล้มเหลว';
        this.toastr.error(msg);
      },
    });
  }
}
