import { CartApi } from '../../../api/cart';
import { getCurrentUserId } from '../../../auth/userSession';
import { addActivity } from '../../activity/store/activityStore';

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

let cart: CartItem[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot() {
  return cart;
}

export function getCartItemsCount() {
  return cart.reduce((s, i) => s + i.quantity, 0);
}

export function getProductsCount() {
  return cart
    .filter(i => i.source === 'PRODUCTS')
    .reduce((s, i) => s + i.quantity, 0);
}

export function getGalleryCount() {
  return cart
    .filter(i => i.source === 'GALLERY')
    .reduce((s, i) => s + i.quantity, 0);
}

export async function refreshCart() {
  const userId = getCurrentUserId();
  if (!userId) {
    cart = [];
    notify();
    return;
  }

  const items = await CartApi.getCart(userId);
  cart = items.map(i => ({
    cartItemId: i.cartItemId,
    id: i.id,
    name: i.name,
    price: Number(i.price),
    quantity: i.quantity,
    source: i.source,
    imageUrl: i.imageUrl ?? undefined,
  }));

  notify();
}

export async function addItemToCart(payload: {
  id: string;
  quantity?: number;
}) {
  const userId = getCurrentUserId();
  if (!userId) return;

  await CartApi.addItem({
    productId: payload.id,
    quantity: payload.quantity ?? 1,
    userId,
  });

  addActivity('ADD_TO_CART');
  await refreshCart();
}

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

export async function removeItemFromCart(cartItemId: string) {
  const userId = getCurrentUserId();
  if (!userId) return;

  await CartApi.removeItem(cartItemId);
  addActivity('REMOVE_FROM_CART');
  await refreshCart();
}

export async function clearCart() {
  const userId = getCurrentUserId();
  if (!userId) {
    cart = [];
    notify();
    return;
  }

  await CartApi.clear(userId);
  cart = [];
  notify();
}

export function resetCartStore() {
  cart = [];
  notify();
}
