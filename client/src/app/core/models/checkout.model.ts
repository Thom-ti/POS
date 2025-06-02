interface CheckoutCartItem {
  cartItemId: string;
  product: string;
  quantity: number;
}

export interface CheckoutRequest {
  cartItems: CheckoutCartItem[];
  paymentMethod: 'cash' | 'card' | 'qr';
}
