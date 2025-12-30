export type CartItemDto = {
  productId: string;
  quantity: number;
};

export type CartDto = {
  items: CartItemDto[];
  totalPrice: number;
};

export type AddToCartRequestDto = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemRequestDto = {
  productId: string;
  quantity: number;
};
