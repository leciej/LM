import type { Product } from '../../products/mockProducts';
import { addToCartStore } from '../store/cartStore';

export function addToCart(product: Product): void {
  addToCartStore(product);
}
