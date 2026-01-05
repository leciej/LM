import type { ProductDto } from '../../../api/products';

export type Source = 'PRODUCTS' | 'GALLERY';

/**
 * Ujednolicony model pozycji w koszyku
 * — UI używa `image`
 * — backend daje `imageUrl`
 */
export type CartItem = ProductDto & {
  cartItemId: string;
  quantity: number;
  source: Source;
  image?: string; // 👈 dla UI
};

let cart: CartItem[] = [];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* utils */
const createCartItemId = () =>
  Math.random().toString(36).slice(2);

/* =========================
   ADD (LOCAL — NIE USUWAMY)
   ========================= */

export function addItemToCart(
  product: ProductDto,
  source: Source
): void {
  const existing = cart.find(
    item =>
      item.id === product.id &&
      item.source === source
  );

  if (existing) {
    cart = cart.map(item =>
      item.cartItemId === existing.cartItemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    cart = [
      ...cart,
      {
        ...product,
        cartItemId: createCartItemId(),
        quantity: 1,
        source,
        image: product.imageUrl, // 👈 MAPOWANIE
      },
    ];
  }

  notify();
}

/* =========================
   READ
   ========================= */

export function getCartSnapshot(): CartItem[] {
  return cart;
}

export function getCartItemsCount(): number {
  return cart.reduce((s, i) => s + i.quantity, 0);
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

/* =========================
   UPDATE / DELETE
   ========================= */

export function decreaseItemInCart(cartItemId: string): void {
  const existing = cart.find(i => i.cartItemId === cartItemId);
  if (!existing) return;

  if (existing.quantity <= 1) {
    cart = cart.filter(i => i.cartItemId !== cartItemId);
  } else {
    cart = cart.map(i =>
      i.cartItemId === cartItemId
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );
  }

  notify();
}

export function removeItemFromCart(cartItemId: string): void {
  cart = cart.filter(i => i.cartItemId !== cartItemId);
  notify();
}

export function clearCart(): void {
  cart = [];
  notify();
}

/* =========================
   BACKEND SYNC  ✅ KLUCZOWE
   ========================= */

export function setCartFromBackend(
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
    source?: Source | null;
  }>
): void {
  cart = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    source: item.source ?? 'PRODUCTS',
    cartItemId: createCartItemId(),
    image: item.imageUrl ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
  })) as CartItem[];

  notify();
}
