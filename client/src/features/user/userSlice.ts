import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/api/axios";

interface UserState {
  users: any[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  isError: false,
  message: "",
};

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/auth/all-users");
      return response.data; // should return array of users
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers: (state) => {
      state.users = [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUsers } = userSlice.actions;
export default userSlice.reducer;
