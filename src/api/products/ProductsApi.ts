import { httpRequest } from '../client';
import {
  ProductDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from './products.types';

export class ProductsApi {
  /**
   * GET /products
   */
  static getAll() {
    return httpRequest<ProductDto[]>({
      method: 'GET',
      url: '/products',
    });
  }

  /**
   * GET /products/:id
   */
  static getById(id: string) {
    return httpRequest<ProductDto>({
      method: 'GET',
      url: `/products/${id}`,
    });
  }

  /**
   * POST /products
   */
  static create(payload: CreateProductRequestDto) {
    return httpRequest<ProductDto, CreateProductRequestDto>({
      method: 'POST',
      url: '/products',
      body: payload,
    });
  }

  /**
   * PUT /products/:id
   */
  static update(id: string, payload: UpdateProductRequestDto) {
    return httpRequest<ProductDto, UpdateProductRequestDto>({
      method: 'PUT',
      url: `/products/${id}`,
      body: payload,
    });
  }

  /**
   * DELETE /products/:id
   */
  static delete(id: string) {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/products/${id}`,
    });
  }
}
