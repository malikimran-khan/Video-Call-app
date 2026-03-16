import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import type { IUser } from "./authTypes";

export interface AuthState {
  user: IUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

// Helper to get user from sessionStorage
const getUserFromSessionStorage = (): IUser | null => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  user: getUserFromSessionStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData: any, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData: { email: string; otp: string }, thunkAPI) => {
    try {
      return await authService.verifyOTP(otpData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData: { username?: string; avatar?: string; bio?: string }, thunkAPI) => {
    try {
      return await authService.updateProfile(userData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Delete Account
export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, thunkAPI) => {
  try {
    return await authService.deleteAccount();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.user = null; // Don't set user until verified and logged in
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // VERIFY OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // DELETE ACCOUNT
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
