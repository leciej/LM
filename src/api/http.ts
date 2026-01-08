import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://10.0.2.2:5225/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* =========================
   REQUEST LOGGING
   ========================= */

http.interceptors.request.use(
  config => {
    console.log(
      '[HTTP REQUEST]',
      config.method?.toUpperCase(),
      config.url,
      config.data ?? ''
    );
    return config;
  },
  error => {
    console.log('[HTTP REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

/* =========================
   RESPONSE LOGGING
   ========================= */

http.interceptors.response.use(
  response => {
    console.log(
      '[HTTP RESPONSE]',
      response.status,
      response.config.url
    );
    return response;
  },
  error => {
    console.log(
      '[HTTP RESPONSE ERROR]',
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    return Promise.reject(error);
  }
);
