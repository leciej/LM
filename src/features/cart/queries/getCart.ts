import { getCartSnapshot } from '../cartStore';
import type { CartItem } from '../cartStore';

export function getCart(): CartItem[] {
  return getCartSnapshot();
}
