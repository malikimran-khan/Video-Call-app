import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import chatService from "./chatService";
import type { IMessage } from "./chatTypes";

interface ChatState {
  messages: IMessage[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isError: false,
  message: "",
};

// 🔹 Fetch messages
export const fetchMessages = createAsyncThunk<
  IMessage[],
  string,
  { rejectValue: string }
>("chat/fetchMessages", async (userId, thunkAPI) => {
  try {
    return await chatService.fetchMessages(userId);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// 🔹 Send message
export const sendMessage = createAsyncThunk<
  IMessage,
  { receiver: string; text: string },
  { rejectValue: string }
>("chat/sendMessage", async (data, thunkAPI) => {
  try {
    return await chatService.sendMessage(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.messages = [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // SEND
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { resetChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
