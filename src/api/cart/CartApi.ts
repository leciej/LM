import { httpRequest } from '../client';

/* =========================
   TYPES
   ========================= */

export type CartItemDto = {
  cartItemId: string;   // CartItems.Id
  id: string;           // TargetId (Product / Gallery)
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
  /* =========================
     GET CART
     ========================= */
  static async getCart(userId: number): Promise<CartItemDto[]> {
    return httpRequest<CartItemDto[]>({
      method: 'GET',
      url: `/cart?userId=${userId}`,
    });
  }

  /* =========================
     ADD ITEM
     ========================= */
  static async addItem(payload: {
    productId: string;
    quantity: number;
    userId: number;
  }): Promise<void> {
    return httpRequest<void>({
      method: 'POST',
      url: '/cart/add',
      body: payload,
    });
  }

  /* =========================
     CHANGE QUANTITY
     ========================= */
  static async changeQuantity(
    cartItemId: string,
    delta: number
  ): Promise<void> {
    return httpRequest<void>({
      method: 'PATCH',
      url: `/cart/${cartItemId}/quantity?delta=${delta}`,
    });
  }

  /* =========================
     REMOVE ITEM
     ========================= */
  static async removeItem(cartItemId: string): Promise<void> {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/cart/${cartItemId}`,
    });
  }

  /* =========================
     CLEAR CART
     ========================= */
  static async clear(userId: number): Promise<void> {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/cart/clear?userId=${userId}`,
    });
  }
}
