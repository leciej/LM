import { httpRequest } from '../client';

type CheckoutResponse = {
  orderId: string;
  totalAmount: number;
};

export class CheckoutApi {
  static async checkout(userId: number): Promise<CheckoutResponse> {
    return httpRequest<CheckoutResponse>({
      method: 'POST',
      url: '/checkout',
      body: { userId },
    });
  }
}
