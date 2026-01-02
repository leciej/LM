import { ApiError } from './ApiError';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions<TBody> = {
  method: HttpMethod;
  url: string;
  body?: TBody;
  headers?: Record<string, string>;
  auth?: boolean;
  timeoutMs?: number;
};

const BASE_URL = 'http://10.0.2.2:5225/api'; // ⬅️ POPRAWIONY PORT
const DEFAULT_TIMEOUT = 15_000;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const buildUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export async function httpRequest<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>,
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = options.timeoutMs ?? DEFAULT_TIMEOUT;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const url = buildUrl(options.url);

  try {
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ApiError({
        message: data?.message ?? `HTTP ${response.status}`,
        status: response.status,
        url,
        data,
      });
    }

    return data as TResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}
