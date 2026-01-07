let currentUserId: number | null = null;

export function setCurrentUserId(id: number | null) {
  currentUserId = id;
}

export function getCurrentUserId(): number | null {
  return currentUserId;
}
