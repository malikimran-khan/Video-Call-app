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

// 🔹 Send voice message
export const sendVoiceMessage = createAsyncThunk<
  IMessage,
  { receiver: string; audio: Blob },
  { rejectValue: string }
>("chat/sendVoiceMessage", async (data, thunkAPI) => {
  try {
    return await chatService.uploadVoice(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// 🔹 Send file message (image, video, document)
export const sendFileMessage = createAsyncThunk<
  IMessage,
  { receiver: string; file: File },
  { rejectValue: string }
>("chat/sendFileMessage", async (data, thunkAPI) => {
  try {
    return await chatService.uploadFile(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

// 🔹 Delete message
export const deleteMessageThunk = createAsyncThunk<
  { messageId: string; isSender: boolean; deletedMessage?: IMessage },
  { messageId: string; isSender: boolean },
  { rejectValue: string }
>("chat/deleteMessage", async ({ messageId, isSender }, thunkAPI) => {
  try {
    const response = await chatService.deleteMessage(messageId);
    return { messageId, isSender, deletedMessage: response.deletedMessage };
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
    // 🔹 Optimistic upload: instantly add a temp message with "uploading" status
    addOptimisticMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    // 🔹 Optimistic upload: replace temp message with real server response
    updateOptimisticMessage: (
      state,
      action: PayloadAction<{ tempId: string; realMessage: IMessage }>
    ) => {
      const index = state.messages.findIndex(
        (m) => m._id === action.payload.tempId
      );
      if (index !== -1) {
        state.messages[index] = action.payload.realMessage;
      }
    },
    // 🔹 Optimistic upload: mark temp message as failed
    failOptimisticMessage: (state, action: PayloadAction<string>) => {
      const msg = state.messages.find((m) => m._id === action.payload);
      if (msg) {
        msg.uploadStatus = "failed";
      }
    },
    // 🔹 Remove an optimistic message (e.g. on cancel)
    removeOptimisticMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (m) => m._id !== action.payload
      );
    },
    // 🔹 Mark a message as deleted by sender (for real-time socket events)
    markMessageDeletedBySender: (state, action: PayloadAction<string>) => {
      const msg = state.messages.find((m) => m._id === action.payload);
      if (msg) {
        msg.deletedBySender = true;
        msg.text = undefined;
        msg.fileUrl = undefined;
        msg.fileName = undefined;
      }
    },
    // 🔹 Remove a message from local state (receiver delete)
    removeMessageLocally: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (m) => m._id !== action.payload
      );
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

      // SEND TEXT (still non-optimistic, it's instant)
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })

      // DELETE MESSAGE
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        const { messageId, isSender, deletedMessage } = action.payload;
        if (isSender && deletedMessage) {
          // Sender delete: replace message with deleted version
          const index = state.messages.findIndex((m) => m._id === messageId);
          if (index !== -1) {
            state.messages[index] = deletedMessage;
          }
        } else {
          // Receiver delete: remove from local state
          state.messages = state.messages.filter((m) => m._id !== messageId);
        }
      });

    // NOTE: sendVoiceMessage and sendFileMessage are now handled
    // via optimistic reducers (addOptimisticMessage / updateOptimisticMessage / failOptimisticMessage)
    // so we no longer auto-push in extraReducers for those.
  },
});

export const {
  resetChat,
  addMessage,
  addOptimisticMessage,
  updateOptimisticMessage,
  failOptimisticMessage,
  removeOptimisticMessage,
  markMessageDeletedBySender,
  removeMessageLocally,
} = chatSlice.actions;
export default chatSlice.reducer;
