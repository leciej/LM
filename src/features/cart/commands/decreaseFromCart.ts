import { decreaseItemInCart } from '../cartStore';

export function decreaseFromCart(productId: string): void {
  decreaseItemInCart(productId);
}
