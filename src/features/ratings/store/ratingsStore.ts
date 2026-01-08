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

export function getAverageRating() {
  if (ratedIds.size === 0) return 0;
  return 4.5;
}

const STOCK_RATINGS_COUNT = 18;
const STOCK_AVERAGE_RATING = 4.2;

export function getRatedCountTotal() {
  return ratedIds.size + STOCK_RATINGS_COUNT;
}

export function getAverageRatingTotal() {
  const userCount = ratedIds.size;
  const userAvg = getAverageRating();

  const totalCount = userCount + STOCK_RATINGS_COUNT;
  if (totalCount === 0) return 0;

  const weightedSum =
    userAvg * userCount +
    STOCK_AVERAGE_RATING * STOCK_RATINGS_COUNT;

  return Math.round((weightedSum / totalCount) * 10) / 10;
}

export function resetRatings() {
  ratedIds.clear();
  emit();
}
