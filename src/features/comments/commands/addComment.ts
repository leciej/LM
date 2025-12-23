import { addCommentToStore } from '../commentsStore';

export function addComment(
  productId: string,
  text: string
): void {
  if (!text.trim()) return;

  addCommentToStore(productId, text);
}
