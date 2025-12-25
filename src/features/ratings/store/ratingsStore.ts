let ratedIds = new Set<string>();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addRating(productId: string) {
  if (!ratedIds.has(productId)) {
    ratedIds.add(productId);
    emit();
  }
}

export function getRatedCount() {
  return ratedIds.size;
}

export function resetRatings() {
  ratedIds.clear();
  emit();
}
