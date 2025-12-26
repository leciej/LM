export type ActivityType =
  | 'COMMENT'
  | 'RATING'
  | 'PURCHASE'
  // ADMIN: produkty
  | 'ADD_PRODUCT'
  | 'EDIT_PRODUCT'
  | 'REMOVE_PRODUCT'
  // ADMIN: arcydzieła (gallery)
  | 'ADD_GALLERY'
  | 'EDIT_GALLERY'
  | 'REMOVE_GALLERY';

export type Activity = {
  type: ActivityType;
  createdAt: number;
};

const MAX_ITEMS = 8; // było 5, dałem trochę więcej żeby admin miał sensowny feed

let activities: Activity[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addActivity(type: ActivityType) {
  activities = [
    { type, createdAt: Date.now() },
    ...activities,
  ].slice(0, MAX_ITEMS);

  emit();
}

export function getActivities(): Activity[] {
  return activities;
}

export function resetActivity() {
  activities = [];
  emit();
}
