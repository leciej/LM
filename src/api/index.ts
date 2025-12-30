import { AuthApi } from './auth';
import { ProductsApi } from './products';
import { CartApi } from './cart';
import { StatsApi } from './stats';
import { GalleryApi } from './gallery';

export const api = {
  auth: AuthApi,
  products: ProductsApi,
  artworks: GalleryApi,
  cart: CartApi,
  stats: StatsApi,
};

export * from './client';
export * from './auth';
export * from './products';
export * from './gallery';
export * from './cart';
export * from './stats';
