import { productsStore } from '../productsStore';

export function removeProduct(productId: string): void {
  productsStore.remove(productId);
}
