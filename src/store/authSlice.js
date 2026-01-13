import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Force page reload to clear all cached data
        window.location.href = '/login';
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;