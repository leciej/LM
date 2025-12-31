import { makeAutoObservable, runInAction } from 'mobx';
import { GalleryItemDto } from '@/api/gallery';
import { getGalleryItemsQuery } from '../queries/getGalleryItems';

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
      const data = await getGalleryItemsQuery();

      runInAction(() => {
        this.items = data;
      });
    } catch (err) {
      runInAction(() => {
        this.error = 'Failed to load gallery';
      });
      console.error('Gallery load error', err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const galleryStore = new GalleryStore();
