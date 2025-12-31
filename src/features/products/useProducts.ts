import { useCallback, useEffect, useState } from "react";
import type {
  ProductDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from "@/api/products";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "./productsBackend";

export function useProducts() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e?.message ?? "Nie udało się pobrać produktów");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(
    async (payload: CreateProductRequestDto) => {
      await createProduct(payload);
      await reload();
    },
    [reload]
  );

  const update = useCallback(
    async (id: string, payload: UpdateProductRequestDto) => {
      await updateProduct(id, payload);
      await reload();
    },
    [reload]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProduct(id);
      await reload();
    },
    [reload]
  );

  return {
    products,
    loading,
    error,
    reload,
    add,
    update,
    remove,
  };
}
