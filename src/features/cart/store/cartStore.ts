import { CartApi } from '../../../api/cart';

/* =========================
   TYPES
   ========================= */

export type Source = 'PRODUCTS' | 'GALLERY';

export type CartItem = {
  cartItemId: string; // backend CartItems.Id
  id: string;         // TargetId (product / gallery item id)
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
   SUBSCRIPTIONS (UI)
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
  const items = await CartApi.getCart();

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

/**
 * Jedyna poprawna funkcja dodawania do koszyka.
 * Frontend przekazuje TYLKO ID.
 */
export async function addItemToCart(
  payload: { id: string; quantity?: number }
): Promise<void> {
  await CartApi.addItem({
    productId: payload.id,
    quantity: payload.quantity ?? 1,
  });

  await refreshCart();
}

/* =========================
   UPDATE
   ========================= */

export async function increaseItemInCart(
  cartItemId: string
): Promise<void> {
  await CartApi.changeQuantity(cartItemId, +1);
  await refreshCart();
}

export async function decreaseItemInCart(
  cartItemId: string
): Promise<void> {
  await CartApi.changeQuantity(cartItemId, -1);
  await refreshCart();
}

/* =========================
   DELETE
   ========================= */

export async function removeItemFromCart(
  cartItemId: string
): Promise<void> {
  await CartApi.removeItem(cartItemId);
  await refreshCart();
}

export async function clearCart(): Promise<void> {
  await CartApi.clear();
  await refreshCart();
}
