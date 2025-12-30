export class ApiError<T = unknown> extends Error {
  readonly status: number | null;
  readonly url: string;
  readonly data: T | null;

  constructor(params: {
    message: string;
    status: number | null;
    url: string;
    data?: T | null;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.url = params.url;
    this.data = params.data ?? null;
  }
}
