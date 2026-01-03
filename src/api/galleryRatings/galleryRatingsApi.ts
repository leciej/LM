import { http } from "@/api";

/* =========================
   TYPES
   ========================= */

export type GalleryRatingSummaryDto = {
  average: number;
  votes: number;
  myRating: number | null;
};

export type CreateGalleryRatingRequestDto = {
  clientId: number;
  value: number; // 1–5
};

/* =========================
   API
   ========================= */

export const GalleryRatingsApi = {
  // GET /api/gallery/{galleryItemId}/ratings
  getByGalleryItemId: async (
    galleryItemId: string
  ): Promise<GalleryRatingSummaryDto> => {
    const { data } = await http.get<GalleryRatingSummaryDto>(
      `/gallery/${galleryItemId}/ratings`
    );
    return data;
  },

  // POST /api/gallery/{galleryItemId}/ratings
  create: async (
    galleryItemId: string,
    payload: CreateGalleryRatingRequestDto
  ): Promise<void> => {
    await http.post(
      `/gallery/${galleryItemId}/ratings`,
      payload
    );
  },
};
