import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://10.0.2.2:5225/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  config => {
    console.log(
      '[HTTP REQUEST]',
      config.method?.toUpperCase(),
      config.url
    );
    return config;
  },
  error => {
    console.log('[HTTP REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

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
      error.message,
      error.config?.url
    );
    return Promise.reject(error);
  }
);
