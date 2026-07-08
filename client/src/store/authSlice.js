import { createSlice } from '@reduxjs/toolkit';

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
    },
    clearSession(state) {
      state.user = null;
      state.role = null;
      state.permissions = [];
      state.ready = true;
    }
  }
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
