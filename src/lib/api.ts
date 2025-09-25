// axios instance with baseURL and interceptors
import { KEYS } from '@/commons/key';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// attach auth token if present (mock)
api.interceptors.request.use(config => {
  const authStore = JSON.parse(localStorage.getItem(KEYS.AUTH_STORAGE) || '{}');
  const token = authStore?.state?.token;
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
