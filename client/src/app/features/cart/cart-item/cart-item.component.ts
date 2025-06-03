import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  private cartService = inject(CartService);
  @Input() cartItem!: CartItem;

  onDelete(): void {
    this.cartService.removeCartItem(this.cartItem._id);
  }
}
