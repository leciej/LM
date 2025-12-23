import { getCommentsSnapshot } from '../commentsStore';
import type { Comment } from '../commentsStore';

export function getComments(productId: string): Comment[] {
  return getCommentsSnapshot(productId);
}
