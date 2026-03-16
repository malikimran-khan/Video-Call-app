import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../components/api/axios";

interface GroupState {
  groups: any[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: GroupState = {
  groups: [],
  isLoading: false,
  isError: false,
  message: "",
};

// Fetch user's groups
export const fetchMyGroups = createAsyncThunk(
  "groups/fetchMy",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/groups/my-groups");
      return response.data;
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

export const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    resetGroups: (state) => {
      state.groups = [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetGroups } = groupSlice.actions;
export default groupSlice.reducer;
