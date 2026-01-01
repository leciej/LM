import { makeAutoObservable, runInAction } from 'mobx';
import { GalleryApi } from '@/api/gallery';
import type {
  GalleryItemDto,
  CreateGalleryItemRequestDto,
  UpdateGalleryItemRequestDto,
} from '@/api/gallery';

export type GalleryItem = GalleryItemDto;

class GalleryStore {
  items: GalleryItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadGallery() {
    this.isLoading = true;
    this.error = null;

    try {
      const data = await GalleryApi.getAll();
      runInAction(() => {
        this.items = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = 'Nie udało się pobrać galerii';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addGallery(payload: CreateGalleryItemRequestDto) {
    const item = await GalleryApi.create(payload);

    runInAction(() => {
      this.items.unshift(item);
    });
  }

  async updateGallery(
    id: string,
    payload: UpdateGalleryItemRequestDto
  ) {
    const updated = await GalleryApi.update(id, payload);

    runInAction(() => {
      const index = this.items.findIndex(
        x => x.id === id
      );
      if (index !== -1) {
        this.items[index] = updated;
      }
    });
  }

  async removeGallery(id: string) {
    await GalleryApi.delete(id);

    runInAction(() => {
      this.items = this.items.filter(
        x => x.id !== id
      );
    });
  }
}

export const galleryStore = new GalleryStore();

/* kompatybilność z AdminAddGalleryScreen */
export const getGallery = () => galleryStore.items;
export const addGallery = (
  payload: CreateGalleryItemRequestDto
) => galleryStore.addGallery(payload);
export const updateGallery = (
  payload: GalleryItem
) =>
  galleryStore.updateGallery(payload.id, payload);
