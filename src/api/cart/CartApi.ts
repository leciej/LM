import { httpRequest } from '../client';
import {
  CartDto,
  AddToCartRequestDto,
  UpdateCartItemRequestDto,
} from './cart.types';

export class CartApi {
  /**
   * GET /cart
   */
  static getCart() {
    return httpRequest<CartDto>({
      method: 'GET',
      url: '/cart',
    });
  }

  /**
   * POST /cart
   */
  static addItem(payload: AddToCartRequestDto) {
    return httpRequest<CartDto, AddToCartRequestDto>({
      method: 'POST',
      url: '/cart',
      body: payload,
    });
  }

  /**
   * PUT /cart
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
   */
  static removeItem(productId: string) {
    return httpRequest<CartDto>({
      method: 'DELETE',
      url: `/cart/${productId}`,
    });
  }

  /**
   * DELETE /cart
   */
  static clear() {
    return httpRequest<void>({
      method: 'DELETE',
      url: '/cart',
    });
  }
}
