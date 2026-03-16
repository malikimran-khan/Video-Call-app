import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import callService from "./callService";
import type { CallState, CallStatus, CallType, ICallHistory } from "./callTypes";

const initialState: CallState = {
    callStatus: "idle",
    callType: null,
    remoteUserId: null,
    remoteUserInfo: null,
    isCaller: false,
    callDuration: 0,
    isMuted: false,
    isCameraOff: false,
    isSpeakerOn: true,
    callHistory: [],
    isLoadingHistory: false,
};

// Fetch call history
export const fetchCallHistory = createAsyncThunk<
    ICallHistory[],
    void,
    { rejectValue: string }
>("call/fetchCallHistory", async (_, thunkAPI) => {
    try {
        const data = await callService.getCallHistory();
        return data.calls;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        // Outgoing call initiated
        startCall: (
            state,
            action: PayloadAction<{
                remoteUserId: string;
                remoteUserInfo: { username: string; avatar?: string };
                callType: CallType;
            }>
        ) => {
            state.callStatus = "calling";
            state.callType = action.payload.callType;
            state.remoteUserId = action.payload.remoteUserId;
            state.remoteUserInfo = action.payload.remoteUserInfo;
            state.isCaller = true;
            state.callDuration = 0;
            state.isMuted = false;
            state.isCameraOff = false;
        },

        // Incoming call received
        receiveCall: (
            state,
            action: PayloadAction<{
                remoteUserId: string;
                remoteUserInfo: { username: string; avatar?: string };
                callType: CallType;
            }>
        ) => {
            state.callStatus = "ringing";
            state.callType = action.payload.callType;
            state.remoteUserId = action.payload.remoteUserId;
            state.remoteUserInfo = action.payload.remoteUserInfo;
            state.isCaller = false;
            state.callDuration = 0;
        },

        // Call connected
        callConnected: (state) => {
            state.callStatus = "connected";
        },

        // Call ended
        callEnded: (state) => {
            state.callStatus = "idle";
            state.callType = null;
            state.remoteUserId = null;
            state.remoteUserInfo = null;
            state.isCaller = false;
            state.callDuration = 0;
            state.isMuted = false;
            state.isCameraOff = false;
        },

        // Update call duration
        updateCallDuration: (state, action: PayloadAction<number>) => {
            state.callDuration = action.payload;
        },

        // Toggle mute
        toggleMute: (state) => {
            state.isMuted = !state.isMuted;
        },

        // Toggle camera
        toggleCamera: (state) => {
            state.isCameraOff = !state.isCameraOff;
        },

        // Toggle speaker
        toggleSpeaker: (state) => {
            state.isSpeakerOn = !state.isSpeakerOn;
        },

        // Set call status directly
        setCallStatus: (state, action: PayloadAction<CallStatus>) => {
            state.callStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCallHistory.pending, (state) => {
                state.isLoadingHistory = true;
            })
            .addCase(fetchCallHistory.fulfilled, (state, action) => {
                state.isLoadingHistory = false;
                state.callHistory = action.payload;
            })
            .addCase(fetchCallHistory.rejected, (state) => {
                state.isLoadingHistory = false;
            });
    },
});

export const {
    startCall,
    receiveCall,
    callConnected,
    callEnded,
    updateCallDuration,
    toggleMute,
    toggleCamera,
    toggleSpeaker,
    setCallStatus,
} = callSlice.actions;

export default callSlice.reducer;
