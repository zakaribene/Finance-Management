import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useResource(url, params = {}) {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  const load = useCallback(async () => {
    if (!url) {
      setState({ loading: false, error: '', data: null });
      return;
    }
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await api.get(url, { params });
      setState({ loading: false, error: '', data: response.data });
    } catch (error) {
      setState({ loading: false, error: error.message || 'Request failed', data: null });
    }
  }, [url, JSON.stringify(params)]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}
