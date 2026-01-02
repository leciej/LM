// api/gallery/GalleryApi.ts
import { httpRequest } from '../client';
import {
  GalleryItemDto,
  CreateGalleryItemRequestDto,
  UpdateGalleryItemRequestDto,
} from './gallery.types';

export class GalleryApi {
  static async getAll(): Promise<GalleryItemDto[]> {
    const res = await httpRequest<GalleryItemDto[]>({
      method: 'GET',
      url: '/gallery',
    });
    return res ?? [];
  }

  static async getById(id: string): Promise<GalleryItemDto> {
    return httpRequest<GalleryItemDto>({
      method: 'GET',
      url: `/gallery/${id}`,
    });
  }

  static async create(
    payload: CreateGalleryItemRequestDto
  ): Promise<GalleryItemDto> {
    return httpRequest<GalleryItemDto, CreateGalleryItemRequestDto>({
      method: 'POST',
      url: '/gallery',
      body: payload,
    });
  }

  static async update(
    id: string,
    payload: UpdateGalleryItemRequestDto
  ): Promise<GalleryItemDto> {
    return httpRequest<GalleryItemDto, UpdateGalleryItemRequestDto>({
      method: 'PUT',
      url: `/gallery/${id}`,
      body: payload,
    });
  }

  static async delete(id: string): Promise<void> {
    return httpRequest<void>({
      method: 'DELETE',
      url: `/gallery/${id}`,
    });
  }
}
