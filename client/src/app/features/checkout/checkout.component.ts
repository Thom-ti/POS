import { Component, DestroyRef, inject } from '@angular/core';
import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  checkoutMessage = '';
  private destroyRef = inject(DestroyRef);

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
  }

  // confirmCheckout(): void {}
}
