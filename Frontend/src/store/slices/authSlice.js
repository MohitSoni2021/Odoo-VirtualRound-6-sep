import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../libs/routeHandler';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    const response = await api.LoginUser(email, password);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData) => {
    const response = await api.RegisterUser(userData);
    return response;
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (token) => {
    const response = await api.VerifyToken(token);
    return response;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (token) => {
    const response = await api.GetCurrentUser(token);
    return response;
  }
);

// Try to get user from localStorage
let storedUser = null;
try {
  const userData = localStorage.getItem('user');
  if (userData) {
    storedUser = JSON.parse(userData);
  }
} catch (error) {
  console.error('Error parsing stored user data:', error);
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        if (action.payload.user?.role) {
          localStorage.setItem('userRole', action.payload.user.role);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Registration successful, but user needs to verify account
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Verify Token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
