import { getCartSnapshot } from '../cartStore';

export function getCartTotal(): number {
  const items = getCartSnapshot();

  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}
