import { http } from '../../api/http';

export type CommentDto = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export async function fetchComments(
  productId: string
): Promise<CommentDto[]> {
  const res = await http.get<CommentDto[]>(
    `/products/${productId}/comments`
  );
  return res.data;
}

export async function addCommentApi(
  productId: string,
  userId: number,
  text: string
): Promise<CommentDto> {
  const res = await http.post<CommentDto>(
    `/products/${productId}/comments`,
    {
      userId,
      text,
    }
  );

  return res.data;
}
