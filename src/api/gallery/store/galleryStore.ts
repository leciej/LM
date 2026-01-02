import { makeAutoObservable, runInAction } from 'mobx';
import { GalleryApi } from '@/api/gallery/GalleryApi';
import { GalleryItemDto } from '@/api/gallery/gallery.types';

class GalleryStore {
  items: GalleryItemDto[] = [];
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
}

export const galleryStore = new GalleryStore();
