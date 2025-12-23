export type Comment = {
  id: string;
  productId: string;
  text: string;
  createdAt: number;
};

let comments: Comment[] = [];

export function addCommentToStore(
  productId: string,
  text: string
): void {
  comments = [
    ...comments,
    {
      id: Date.now().toString(),
      productId,
      text,
      createdAt: Date.now(),
    },
  ];
}

export function getCommentsSnapshot(
  productId: string
): Comment[] {
  return comments.filter(
    comment => comment.productId === productId
  );
}
