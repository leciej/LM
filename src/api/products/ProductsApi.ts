import { http } from "@/api";
import {
  ProductDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "./products.types";

export const ProductsApi = {

  getAll: async (): Promise<ProductDto[]> => {
    const { data } = await http.get<ProductDto[]>("/products");
    return data;
  },


  getById: async (id: string): Promise<ProductDto> => {
    const { data } = await http.get<ProductDto>(`/products/${id}`);
    return data;
  },


  create: async (
    payload: CreateProductRequestDto
  ): Promise<ProductDto> => {
    const { data } = await http.post<ProductDto>(
      "/products",
      payload
    );
    return data;
  },


  update: async (
    id: string,
    payload: UpdateProductRequestDto
  ): Promise<void> => {
    await http.patch(`/products/${id}`, payload);
  },


  remove: async (id: string): Promise<void> => {
    await http.delete(`/products/${id}`);
  },
};
