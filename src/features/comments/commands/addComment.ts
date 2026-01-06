import { addCommentApi } from '../commentsApi';

export async function addComment(
  productId: string,
  text: string,
  userId: number
) {
  if (!text.trim()) return;

  await addCommentApi(productId, userId, text);
}
