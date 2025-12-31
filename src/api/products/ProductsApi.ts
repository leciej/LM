import { http } from "@/api";
import {
  ProductDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "./products.types";

export const ProductsApi = {
  // GET /api/products
  getAll: async (): Promise<ProductDto[]> => {
    const { data } = await http.get<ProductDto[]>("/products");
    return data;
  },

  // GET /api/products/{id}
  getById: async (id: string): Promise<ProductDto> => {
    const { data } = await http.get<ProductDto>(`/products/${id}`);
    return data;
  },

  // POST /api/products
  create: async (
    payload: CreateProductRequestDto
  ): Promise<ProductDto> => {
    const { data } = await http.post<ProductDto>(
      "/products",
      payload
    );
    return data;
  },

  // PATCH /api/products/{id}
  update: async (
    id: string,
    payload: UpdateProductRequestDto
  ): Promise<void> => {
    await http.patch(`/products/${id}`, payload);
  },

  // DELETE /api/products/{id}
  remove: async (id: string): Promise<void> => {
    await http.delete(`/products/${id}`);
  },
};
