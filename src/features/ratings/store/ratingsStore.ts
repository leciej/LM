import { addActivity } from '../../activity/store/activityStore';

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
    addActivity('RATING');
    emit();
  }
}

export function getRatedCount() {
  return ratedIds.size;
}

/* ✅ DEMO – backend-ready */
export function getAverageRating() {
  if (ratedIds.size === 0) return 0;
  return 4.5;
}

export function resetRatings() {
  ratedIds.clear();
  emit();
}
