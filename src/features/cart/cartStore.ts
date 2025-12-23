import type { Product } from '../products/mockProducts';

export type CartItem = Product & {
  quantity: number;
};

let cart: CartItem[] = [];

export function addItemToCart(product: Product): void {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    cart = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    return;
  }

  cart = [...cart, { ...product, quantity: 1 }];
}

export function getCartSnapshot(): CartItem[] {
  return cart;
}

export function clearCart(): void {
  cart = [];
}

export function decreaseItemInCart(productId: string): void {
  const existing = cart.find(item => item.id === productId);
  if (!existing) return;

  if (existing.quantity <= 1) {
    cart = cart.filter(item => item.id !== productId);
    return;
  }

  cart = cart.map(item =>
    item.id === productId
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
}

export function removeItemFromCart(productId: string): void {
  cart = cart.filter(item => item.id !== productId);
}
