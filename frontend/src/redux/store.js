import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice'; // Make sure to adjust the import path

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the authReducer to the store
  },
});

export default store;
