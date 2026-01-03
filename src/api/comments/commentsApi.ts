import { http } from "@/api";

/* =========================
   TYPES
   ========================= */

export type CommentDto = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type CreateCommentRequestDto = {
  clientId: number;
  authorName: string;
  text: string;
};

/* =========================
   API
   ========================= */

export const CommentsApi = {
  // GET /api/products/{productId}/comments
  getByProductId: async (
    productId: string
  ): Promise<CommentDto[]> => {
    const { data } = await http.get<CommentDto[]>(
      `/products/${productId}/comments`
    );
    return data;
  },

  // POST /api/products/{productId}/comments
  create: async (
    productId: string,
    payload: CreateCommentRequestDto
  ): Promise<CommentDto> => {
    const { data } = await http.post<CommentDto>(
      `/products/${productId}/comments`,
      payload
    );
    return data;
  },
};
