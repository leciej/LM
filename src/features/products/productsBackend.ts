import { ProductsApi } from "@/api/products";
import type {
  ProductDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "@/api/products";

/**
 * NOWA warstwa backendowa dla produktów
 * — cienki wrapper nad ProductsApi
 * — UI / hooki nie wiedzą nic o HTTP
 */

export async function fetchProducts(): Promise<ProductDto[]> {
  return ProductsApi.getAll();
}

export async function createProduct(
  payload: CreateProductRequestDto
): Promise<ProductDto> {
  return ProductsApi.create(payload);
}

export async function updateProduct(
  productId: string,
  payload: UpdateProductRequestDto
): Promise<void> {
  return ProductsApi.update(productId, payload);
}

export async function deleteProduct(productId: string): Promise<void> {
  return ProductsApi.remove(productId);
}
