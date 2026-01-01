import { AuthApi } from "./auth";
import { CartApi } from "./cart";
import { GalleryApi } from "./gallery";
import { StatsApi } from "./stats";

import * as ProductsApi from "./products";

export const api = {
  auth: AuthApi,
  products: ProductsApi,
  gallery: GalleryApi,
  cart: CartApi,
  stats: StatsApi,
};

export * from "./client";
export * from "./auth";
export * from "./products";
export * from "./gallery";
export * from "./cart";
export * from "./stats";
export * from "./http";
