export interface ICallHistory {
    _id: string;
    caller: { _id: string; username: string; avatar?: string };
    receiver: { _id: string; username: string; avatar?: string };
    callType: "voice" | "video";
    status: "missed" | "declined" | "completed" | "no_answer";
    duration: number;
    startedAt?: string;
    endedAt?: string;
    createdAt: string;
}

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";
export type CallType = "voice" | "video";

export interface CallState {
    callStatus: CallStatus;
    callType: CallType | null;
    remoteUserId: string | null;
    remoteUserInfo: { username: string; avatar?: string } | null;
    isCaller: boolean;
    callDuration: number;
    isMuted: boolean;
    isCameraOff: boolean;
    isSpeakerOn: boolean;
    callHistory: ICallHistory[];
    isLoadingHistory: boolean;
}
