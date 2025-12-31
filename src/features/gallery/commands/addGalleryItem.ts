import { GalleryApi } from '@/api/gallery';
import { CreateGalleryItemRequestDto } from '@/api/gallery/gallery.types';

export async function addGalleryItemCommand(
  payload: CreateGalleryItemRequestDto
) {
  return GalleryApi.create(payload);
}
