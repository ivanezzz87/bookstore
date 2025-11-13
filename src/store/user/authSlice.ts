// src/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

const API_BASE = 'https://studapi.teachmeskills.by';

interface AuthState {
  user: { email: string } | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  activationStatus: 'success' | 'failure' | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  activationStatus: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { username: string; email: string; password: string; re_password: string; course_group?: number },
    { rejectWithValue }
  ) => {
    try {
      await axios.post(`${API_BASE}/auth/users/`, data);
    } catch (error: unknown) {
      const err = error as AxiosError<{ [key: string]: string[] }>;
      if (err.response?.data) {
        return rejectWithValue(JSON.stringify(err.response.data));
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const activate = createAsyncThunk(
  'auth/activate',
  async ({ uid, token }: { uid: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE}/auth/users/activation/`, { uid, token });
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return rejectWithValue('Activation failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/jwt/create/`, { email, password });
      return { 
        access: response.data.access, 
        user: { email } 
      };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivationStatus: (state) => {
      state.activationStatus = null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Activate
      .addCase(activate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.activationStatus = null;
      })
      .addCase(activate.fulfilled, (state) => {
        state.isLoading = false;
        state.activationStatus = 'success';
        state.error = null;
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.activationStatus = 'failure';
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.access;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearActivationStatus, logout } = authSlice.actions;
export default authSlice.reducer;