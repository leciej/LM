export type GalleryItemDto = {
  id: string;
  title: string;
  artist: string;
  description?: string;
  year?: number;
  price?: number;
  imageUrl?: string;
};

export type CreateGalleryItemRequestDto = Omit<GalleryItemDto, 'id'>;
export type UpdateGalleryItemRequestDto = Partial<CreateGalleryItemRequestDto>;
