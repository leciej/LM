import { makeAutoObservable, runInAction } from 'mobx';
import { GalleryItemDto } from '@/api/gallery';
import { getGalleryItemsQuery } from '../queries/getGalleryItems';

class GalleryStore {
  items: GalleryItemDto[] = [];
  loaded = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    if (this.loaded || this.isLoading) return;

    this.isLoading = true;

    try {
      const data = await getGalleryItemsQuery();
      runInAction(() => {
        this.items = data;
        this.loaded = true;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  remove(id: string) {
    this.items = this.items.filter(x => x.id !== id);
  }
}

export const galleryStore = new GalleryStore();
