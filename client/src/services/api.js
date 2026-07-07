import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : '/api/v1'),
  withCredentials: true
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const authPublicRoutes = ['/auth/login', '/auth/register', '/auth/google', '/auth/refresh'];
    const shouldSkipRefresh = authPublicRoutes.some((route) => original?.url?.includes(route));
    if (error.response?.status === 401 && !original._retry && !shouldSkipRefresh) {
      original._retry = true;
      try {
        const refreshed = await api.post('/auth/refresh');
        setAccessToken(refreshed.data.accessToken);
        original.headers.Authorization = `Bearer ${refreshed.data.accessToken}`;
        return api(original);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);
