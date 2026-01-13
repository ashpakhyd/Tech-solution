import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authSlice from './authSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;