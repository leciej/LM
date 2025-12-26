import { addActivity } from '../../activity/store/activityStore';

/* =========================
   USER RATINGS (REAL)
   ========================= */

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

/* =========================
   USER GETTERS
   ========================= */

export function getRatedCount() {
  return ratedIds.size;
}

/* DEMO – średnia użytkownika */
export function getAverageRating() {
  if (ratedIds.size === 0) return 0;
  return 4.5;
}

/* =========================
   STOCK RATINGS (DEMO)
   ========================= */

/**
 * Symulacja ocen stockowych
 * backend → API → aggregate
 */
const STOCK_RATINGS_COUNT = 18;
const STOCK_AVERAGE_RATING = 4.2;

/* =========================
   ADMIN / TOTAL GETTERS
   ========================= */

/**
 * Łączna liczba ocen (user + stock)
 */
export function getRatedCountTotal() {
  return ratedIds.size + STOCK_RATINGS_COUNT;
}

/**
 * Łączna średnia (user + stock)
 */
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

/* =========================
   RESET
   ========================= */

export function resetRatings() {
  ratedIds.clear();
  emit();
}
