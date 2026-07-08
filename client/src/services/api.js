import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '/api/v1'),
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);
