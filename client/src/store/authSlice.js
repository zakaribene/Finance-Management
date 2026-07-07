import { createSlice } from '@reduxjs/toolkit';
import { setAccessToken } from '../services/api.js';

const initialState = { user: null, role: null, permissions: [], ready: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions || [];
      state.ready = true;
      setAccessToken(action.payload.accessToken);
    },
    clearSession(state) {
      state.user = null;
      state.role = null;
      state.permissions = [];
      state.ready = true;
      setAccessToken(null);
    }
  }
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
