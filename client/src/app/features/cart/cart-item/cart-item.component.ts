import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-item',
  imports: [RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  private cartService = inject(CartService);
  private toastr = inject(ToastrService);

  @Input() cartItem!: CartItem;

  onDelete(): void {
    this.cartService.removeCartItem(this.cartItem._id).subscribe({
      next: () => {
        this.toastr.success('ลบสินค้าจากตะกร้าแล้ว');
      },
      error: (err) => {
        const msg = err?.error?.message || 'ไม่สามารถลบสินค้าได้';
        this.toastr.error(msg);
      },
    });
  }
}
