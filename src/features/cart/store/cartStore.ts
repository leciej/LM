import { CartApi } from '../../../api/cart';
import { getCurrentUserId } from '../../../auth/userSession';

/* =========================
   TYPES
   ========================= */

export type Source = 'PRODUCTS' | 'GALLERY';

export type CartItem = {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  source: Source;
  imageUrl?: string;
};

/* =========================
   STATE
   ========================= */

let cart: CartItem[] = [];

/* =========================
   SUBSCRIPTIONS
   ========================= */

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach(listener => listener());
};

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* =========================
   READ
   ========================= */

export function getCartSnapshot(): CartItem[] {
  return cart;
}

export function getCartItemsCount(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getProductsCount(): number {
  return cart
    .filter(item => item.source === 'PRODUCTS')
    .reduce((sum, item) => sum + item.quantity, 0);
}

export function getGalleryCount(): number {
  return cart
    .filter(item => item.source === 'GALLERY')
    .reduce((sum, item) => sum + item.quantity, 0);
}

/* =========================
   BACKEND → STORE
   ========================= */

export async function refreshCart(): Promise<void> {
  const userId = getCurrentUserId();

  // 🔥 KLUCZOWE: brak usera = pusty koszyk
  if (!userId) {
    cart = [];
    notify();
    return;
  }

  const items = await CartApi.getCart(userId);

  cart = items.map(item => ({
    cartItemId: item.cartItemId,
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    source: item.source,
    imageUrl: item.imageUrl ?? undefined,
  }));

  notify();
}

/* =========================
   ADD
   ========================= */

export async function addItemToCart(payload: {
  id: string;
  quantity?: number;
}): Promise<void> {
  const userId = getCurrentUserId();

  // 🔥 bez usera NIE dodajemy
  if (!userId) return;

  await CartApi.addItem({
    productId: payload.id,
    quantity: payload.quantity ?? 1,
    userId,
  });

  await refreshCart();
}

/* =========================
   UPDATE
   ========================= */

export async function increaseItemInCart(cartItemId: string) {
  const userId = getCurrentUserId();
  if (!userId) return;

  await CartApi.changeQuantity(cartItemId, +1);
  await refreshCart();
}

export async function decreaseItemInCart(cartItemId: string) {
  const userId = getCurrentUserId();
  if (!userId) return;

  await CartApi.changeQuantity(cartItemId, -1);
  await refreshCart();
}

/* =========================
   DELETE
   ========================= */

export async function removeItemFromCart(cartItemId: string) {
  const userId = getCurrentUserId();
  if (!userId) return;

  await CartApi.removeItem(cartItemId);
  await refreshCart();
}

export async function clearCart() {
  const userId = getCurrentUserId();

  // 🔥 GOŚĆ / BRAK USERA → lokalnie
  if (!userId) {
    cart = [];
    notify();
    return;
  }

  await CartApi.clear(userId);
  cart = [];
  notify();
}

/* =========================
   RESET (LOGOUT)
   ========================= */

export function resetCartStore() {
  cart = [];
  notify();
}
