interface CheckoutCartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  cartItems: CheckoutCartItem[];
  paymentMethod: 'cash' | 'card' | 'qr';
}
