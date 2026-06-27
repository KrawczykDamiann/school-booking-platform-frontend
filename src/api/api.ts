import axios from 'axios';
import { tokenService } from '../utils/tokenService';

export const api = axios.create({
  baseURL: 'http://localhost:8082',
});

api.interceptors.request.use((config) => {
  const token = tokenService.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});