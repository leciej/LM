// features/gallery/queries/getGalleryItems.ts
import { GalleryApi } from '@/api/gallery';

export const getGalleryItemsQuery = async () => {
  const data = await GalleryApi.getAll();
  return Array.isArray(data) ? data : [];
};
