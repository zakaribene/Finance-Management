import { createAuthClient } from 'better-auth/react';

const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : `${window.location.origin}/api/v1`);
const serverOrigin = apiUrl.replace(/\/api\/v1\/?$/, '');

export const authClient = createAuthClient({
  baseURL: `${serverOrigin}/api/auth`
});
