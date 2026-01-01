import { makeAutoObservable, runInAction } from 'mobx';
import { GalleryItemDto } from '@/api/gallery';
import { getGalleryItemsQuery } from '../queries/getGalleryItems';

type Listener = () => void;

class GalleryStore {
  items: GalleryItemDto[] = [];
  isLoading = false;
  error: string | null = null;

  private listeners = new Set<Listener>();

  constructor() {
    makeAutoObservable(this);
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.listeners.forEach(l => l());
  }

  getSnapshot = () => {
    return this.items;
  };

  async loadGallery() {
    this.isLoading = true;
    this.error = null;
    this.notify();

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
      this.notify();
    }
  }
}

export const galleryStore = new GalleryStore();

export const subscribe = (listener: Listener) =>
  galleryStore.subscribe(listener);

export const getGallery = () =>
  galleryStore.getSnapshot();
