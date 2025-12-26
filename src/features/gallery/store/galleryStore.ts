export type GalleryItem = {
  id: string;
  title: string;
  author: string;
  image: string;
};

export const mockGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Akwarela Ultramarine Blue – Ambitny Kobalt',
    author: 'Akademia Farb Wodnych',
    image: 'https://picsum.photos/600/400?1',
  },
  {
    id: '2',
    title: 'Akwarela Burnt Sienna – Kontrolowany Chaos',
    author: 'Akademia Farb Wodnych',
    image: 'https://picsum.photos/600/400?2',
  },
];

let gallery = [...mockGallery];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(l => l());

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGallery() {
  return gallery;
}

export function addGallery(item: GalleryItem) {
  gallery = [item, ...gallery];
  emit();
}

export function updateGallery(item: GalleryItem) {
  gallery = gallery.map(g =>
    g.id === item.id ? item : g
  );
  emit();
}

export function removeGallery(id: string) {
  gallery = gallery.filter(g => g.id !== id);
  emit();
}
