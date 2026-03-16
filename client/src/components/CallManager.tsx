import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { receiveCall, callConnected } from "../features/call/callSlice";
import CallScreen from "../pages/user/CallScreen";
import IncomingCallModal from "./IncomingCallModal";
import { io, Socket } from "socket.io-client";

const CallManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { callStatus } = useSelector((state: RootState) => state.call);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      const token = sessionStorage.getItem("token");
      const newSocket = io("http://localhost:5000", {
        query: { userId: currentUser.id },
        auth: { token },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ from, callType, offer, callerInfo }: any) => {
      // If already in a call, auto-reject
      if (callStatus !== "idle") {
        socket.emit("call:busy", { to: from });
        return;
      }

      setIncomingOffer(offer);
      dispatch(
        receiveCall({
          remoteUserId: from,
          remoteUserInfo: {
            username: callerInfo?.username || "Unknown",
            avatar: callerInfo?.avatar,
          },
          callType,
        })
      );
    };

    socket.on("call:incoming", handleIncomingCall);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
    };
  }, [socket, callStatus, dispatch]);

  // Handle accept from IncomingCallModal
  const handleAcceptCall = useCallback(
    (pc: RTCPeerConnection, stream: MediaStream) => {
      peerConnectionRef.current = pc;
      localStreamRef.current = stream;
      dispatch(callConnected());
    },
    [dispatch]
  );

  // Expose socket globally for ChatUser to use for calling
  useEffect(() => {
    if (socket) {
      (window as any).__callSocket = socket;
    }
    return () => {
      delete (window as any).__callSocket;
    };
  }, [socket]);

  return (
    <>
      <CallScreen socket={socket} />
      <IncomingCallModal socket={socket} incomingOffer={incomingOffer} onAccept={handleAcceptCall} />
    </>
  );
};

export default CallManager;
