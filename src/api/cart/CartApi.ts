import { httpRequest } from '../client';

/* =========================
   TYPES
   ========================= */

/**
 * DTO zwracane przez backend: GET /api/cart
 * Backend jest źródłem prawdy (price, name, source).
 */
export type CartItemDto = {
  cartItemId: string;
  id: string; // TargetId (Product / Gallery item id)
  name: string;
  price: number;
  quantity: number;
  source: 'PRODUCTS' | 'GALLERY';
  imageUrl?: string | null;
};

/* =========================
   API
   ========================= */

export class CartApi {
  // =====================================================
  // GET /api/cart
  // =====================================================
  static getCart(userId?: number) {
    const url = userId
      ? `/cart?userId=${userId}`
      : '/cart';

    return httpRequest<CartItemDto[]>({
      method: 'GET',
      url,
    });
  }

  // =====================================================
  // POST /api/cart/add
  // Frontend wysyła TYLKO ID (+ opcjonalnie quantity)
  // =====================================================
  static addItem(payload: {
    productId: string;
    quantity?: number;
  }) {
    return httpRequest<void>({
      method: 'POST',
      url: '/cart/add',
      body: {
        productId: payload.productId,
        quantity: payload.quantity ?? 1,
      },
    });
  }

  // =====================================================
  // PATCH /api/cart/{cartItemId}/quantity?delta=±1
  // =====================================================
  static changeQuantity(cartItemId: string, delta: number) {
    return httpRequest<void>({
      method: 'PATCH',
      url: `/cart/${cartItemId}/quantity?delta=${delta}`,
    });
  }

  // =====================================================
  // DELETE /api/cart/{cartItemId}
  // =====================================================
  static removeItem(cartItemId: string) {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/cart/${cartItemId}`,
    });
  }

  // =====================================================
  // DELETE /api/cart/clear
  // =====================================================
  static clear(userId?: number) {
    const url = userId
      ? `/cart/clear?userId=${userId}`
      : '/cart/clear';

    return httpRequest<void>({
      method: 'DELETE',
      url,
    });
  }
}
