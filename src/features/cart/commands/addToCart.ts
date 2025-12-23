import type { Product } from '../../products/mockProducts';
import { addItemToCart } from '../cartStore';

export function addToCart(product: Product): void {
  addItemToCart(product);
}
