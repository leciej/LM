import { removeItemFromCart } from '../cartStore';

export function removeFromCart(productId: string): void {
  removeItemFromCart(productId);
}
