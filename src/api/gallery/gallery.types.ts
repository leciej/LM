export interface GalleryItemDto {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  createdAt?: string;
}

export interface CreateGalleryItemRequestDto {
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
}

export interface UpdateGalleryItemRequestDto {
  title: string;
  artist: string;
  price: number;
  imageUrl?: string;
}
