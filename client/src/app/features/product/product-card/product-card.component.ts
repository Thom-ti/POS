import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  @Input() product!: Product;
  quantity: number = 1;

  increaseQuantity() {
    if (this.quantity >= this.product.stock) return;
    this.quantity += 1;
  }

  decreaseQuantity() {
    if (this.quantity <= 1) return;
    this.quantity -= 1;
  }

  addToCart() {
    const body = {
      product: this.product._id,
      quantity: this.quantity,
    };

    this.cartService.postCartItem(body);
  }
}
