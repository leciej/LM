import { httpRequest } from '../client';
import {
  CartDto,
  AddToCartRequestDto,
  UpdateCartItemRequestDto,
} from './cart.types';

export class CartApi {
  /**
   * GET /cart
   * (na razie backend nie ma GET /api/cart — zostawiamy, żeby nie rozwalić appki;
   * dodamy endpoint w kolejnym kroku)
   */
  static getCart() {
    return httpRequest<CartDto>({
      method: 'GET',
      url: '/cart',
    });
  }

  /**
   * POST /cart/add  ✅ zgodne z backendem: POST /api/cart/add
   */
  static addItem(payload: AddToCartRequestDto) {
    return httpRequest<{ orderId: string; itemId: string }, AddToCartRequestDto>({
      method: 'POST',
      url: '/cart/add',
      body: {
        ...payload,
        // pewniak: backend ma Quantity:int
        quantity: Number((payload as any).quantity ?? 1),
      } as AddToCartRequestDto,
    });
  }

  /**
   * PUT /cart
   * (backend jeszcze nie ma — zostawiamy; dodamy później)
   */
  static updateItem(payload: UpdateCartItemRequestDto) {
    return httpRequest<CartDto, UpdateCartItemRequestDto>({
      method: 'PUT',
      url: '/cart',
      body: payload,
    });
  }

  /**
   * DELETE /cart/:productId
   * (backend jeszcze nie ma — zostawiamy; dodamy później)
   */
  static removeItem(productId: string) {
    return httpRequest<CartDto>({
      method: 'DELETE',
      url: `/cart/${productId}`,
    });
  }

  /**
   * DELETE /cart
   * (backend jeszcze nie ma — zostawiamy; dodamy później)
   */
  static clear() {
    return httpRequest<void>({
      method: 'DELETE',
      url: '/cart',
    });
  }
}
