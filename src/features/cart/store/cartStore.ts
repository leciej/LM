import type { Product } from '../../products/mockProducts';

export type Source = 'PRODUCTS' | 'GALLERY';

export type CartItem = Product & {
  quantity: number;
  source: Source;
};

let cart: CartItem[] = [];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ADD */

export function addItemToCart(
  product: Product,
  source: Source
): void {
  const existing = cart.find(
    item =>
      item.id === product.id &&
      item.source === source
  );

  if (existing) {
    cart = cart.map(item =>
      item === existing
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    cart = [
      ...cart,
      { ...product, quantity: 1, source },
    ];
  }

  notify();
}

/* READ */

export function getCartSnapshot(): CartItem[] {
  return cart;
}

export function getCartItemsCount(): number {
  return cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

export function getProductsCount(): number {
  return cart
    .filter(i => i.source === 'PRODUCTS')
    .reduce((s, i) => s + i.quantity, 0);
}

export function getGalleryCount(): number {
  return cart
    .filter(i => i.source === 'GALLERY')
    .reduce((s, i) => s + i.quantity, 0);
}

/* UPDATE / DELETE */

export function decreaseItemInCart(
  id: string,
  source: Source
): void {
  const existing = cart.find(
    i => i.id === id && i.source === source
  );
  if (!existing) return;

  if (existing.quantity <= 1) {
    cart = cart.filter(i => i !== existing);
  } else {
    cart = cart.map(i =>
      i === existing
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );
  }

  notify();
}

export function removeItemFromCart(
  id: string,
  source: Source
): void {
  cart = cart.filter(
    i => !(i.id === id && i.source === source)
  );
  notify();
}

export function clearCart(): void {
  cart = [];
  notify();
}
