import { fetchComments } from '../commentsApi';

export async function getComments(
  productId: string
) {
  return await fetchComments(productId);
}
