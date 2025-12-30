import { api } from '@/api';
import { GalleryItemDto } from '@/api/gallery';

/**
 * QUERY — READ ONLY
 * Pobiera elementy galerii z backendu
 */
export const getGalleryItemsQuery = async (): Promise<GalleryItemDto[]> => {
  return api.gallery.getAll();
};
