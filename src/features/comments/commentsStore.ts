export type Comment = {
  id: string;
  productId: string;
  text: string;
  createdAt: number;
};

let comments: Comment[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

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

  emit(); // ✅ informujemy profil
}

export function getCommentsSnapshot(
  productId: string
): Comment[] {
  return comments.filter(
    comment => comment.productId === productId
  );
}

export function getCommentsCount(): number {
  return comments.length;
}

export function resetComments() {
  comments = [];
  emit();
}
