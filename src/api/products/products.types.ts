/**
 * DTO produktów – dokładnie to, co przychodzi z backendu
 */

export type ProductDto = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductRequestDto = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export type UpdateProductRequestDto = {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
};
