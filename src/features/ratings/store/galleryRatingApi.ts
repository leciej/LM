import { http } from '../../../api/http';

/* =========================
   TYPES
   ========================= */

export type GalleryRatingSummaryDto = {
  average: number;
  votes: number;
  myRating: number | null;
};

/* =========================
   API
   ========================= */

/**
 * GET /api/gallery/{galleryItemId}/ratings?userId=?
 */
export async function fetchGalleryRatings(
  galleryItemId: string,
  userId?: number
): Promise<GalleryRatingSummaryDto> {
  const query =
    userId !== undefined ? `?userId=${userId}` : '';

  const res = await http.get<GalleryRatingSummaryDto>(
    `/gallery/${galleryItemId}/ratings${query}`
  );

  return res.data;
}

/**
 * POST /api/gallery/{galleryItemId}/ratings
 */
export async function addGalleryRating(
  galleryItemId: string,
  userId: number,
  value: number
): Promise<void> {
  await http.post(
    `/gallery/${galleryItemId}/ratings`,
    {
      userId,
      value,
    }
  );
}
