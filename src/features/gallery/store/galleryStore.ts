import { addActivity } from '../../activity/store/activityStore';

export type GalleryItem = {
  id: string;
  title: string;
  author: string;
  image?: string;
};

let gallery: GalleryItem[] = [];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGallery() {
  return gallery;
}

export function addGalleryItem(item: GalleryItem) {
  gallery = [item, ...gallery];
  addActivity('ADD_GALLERY');
  emit();
}

export function removeGalleryItem(id: string) {
  gallery = gallery.filter(g => g.id !== id);
  addActivity('REMOVE_GALLERY');
  emit();
}
