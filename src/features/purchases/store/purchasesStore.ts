import type { CartItem } from '../../cart/store/cartStore';
import { addActivity } from '../../activity/store/activityStore';

let purchased: CartItem[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addPurchase(items: CartItem[]) {
  purchased.push(...items);
  addActivity('PURCHASE');
  emit();
}

export function getPurchasedCount() {
  return purchased.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

/* ✅ NOWE */
export function getTotalSpent() {
  return purchased.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );
}

export function resetPurchases() {
  purchased = [];
  emit();
}
