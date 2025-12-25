import type { CartItem } from '../../cart/store/cartStore';

let purchased: CartItem[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addPurchase(items: CartItem[]) {
  purchased.push(...items);
  emit();
}

export function getPurchasedCount() {
  return purchased.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

export function resetPurchases() {
  purchased = [];
  emit();
}
