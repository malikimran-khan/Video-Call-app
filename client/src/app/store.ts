import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import chatReducer from "../features/chat/chatSlice"
import callReducer from "../features/call/callSlice"
import groupReducer from "../features/group/groupSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
        chat: chatReducer,
        call: callReducer,
        groups: groupReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
