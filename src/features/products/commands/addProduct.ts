import { mockProducts, Product } from '../mockProducts';

export function addProduct(product: Product): void {
  mockProducts.push(product);
}
