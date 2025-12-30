import { httpRequest } from '../client';
import {
  GalleryItemDto,
  CreateGalleryItemRequestDto,
  UpdateGalleryItemRequestDto,
} from './gallery.types';

export class GalleryApi {
  static getAll() {
    return httpRequest<GalleryItemDto[]>({
      method: 'GET',
      url: '/gallery', // jeśli backend ma /artworks → tu zostaje /artworks
    });
  }

  static getById(id: string) {
    return httpRequest<GalleryItemDto>({
      method: 'GET',
      url: `/gallery/${id}`,
    });
  }

  static create(payload: CreateGalleryItemRequestDto) {
    return httpRequest<GalleryItemDto, CreateGalleryItemRequestDto>({
      method: 'POST',
      url: '/gallery',
      body: payload,
    });
  }

  static update(id: string, payload: UpdateGalleryItemRequestDto) {
    return httpRequest<GalleryItemDto, UpdateGalleryItemRequestDto>({
      method: 'PUT',
      url: `/gallery/${id}`,
      body: payload,
    });
  }

  static delete(id: string) {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/gallery/${id}`,
    });
  }
}
