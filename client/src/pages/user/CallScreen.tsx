import React, { useEffect, useRef, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaVolumeUp, FaUser, FaInfoCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import {
  callConnected,
  callEnded,
  toggleMute,
  toggleCamera,
  toggleSpeaker,
  updateCallDuration,
} from "../../features/call/callSlice";
import {
  createPeerConnection,
  createOffer,
  setRemoteDescription,
  addIceCandidate,
  getMediaStream,
  stopMediaStream,
} from "../../utils/webrtcUtils";
import type { Socket } from "socket.io-client";
import { motion } from "framer-motion";

interface CallScreenProps {
  socket: Socket | null;
}

const CallScreen: React.FC<CallScreenProps> = ({ socket }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { callStatus, callType, remoteUserId, remoteUserInfo, isCaller, isMuted, isCameraOff, callDuration } =
    useSelector((state: RootState) => state.call);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);
  const noAnswerTimeoutRef = useRef<any>(null);
  const offerRef = useRef<RTCSessionDescriptionInit | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (noAnswerTimeoutRef.current) clearTimeout(noAnswerTimeoutRef.current);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    stopMediaStream(localStreamRef.current);
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    offerRef.current = null;
    iceCandidatesQueue.current = [];
  }, []);

  const handleEndCall = useCallback(() => {
    if (socket && remoteUserId) {
      if (callStatus === "calling") {
        socket.emit("call:no-answer", { to: remoteUserId, callType });
      } else {
        socket.emit("call:end", { to: remoteUserId, callType });
      }
    }
    cleanup();
    dispatch(callEnded());
  }, [socket, remoteUserId, callStatus, callType, cleanup, dispatch]);

  useEffect(() => {
    if (callStatus === "idle" || !socket || !remoteUserId || !callType) return;
    const initCall = async () => {
      try {
        const stream = await getMediaStream(callType);
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const pc = createPeerConnection(
          (candidate) => { socket.emit("call:ice-candidate", { to: remoteUserId, candidate }); },
          (remoteStream) => {
            remoteStreamRef.current = remoteStream;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          },
          (state) => {
            if (state === "connected") dispatch(callConnected());
            else if (state === "disconnected" || state === "failed") handleEndCall();
          }
        );
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        peerConnectionRef.current = pc;
        if (isCaller) {
          const offer = await createOffer(pc);
          offerRef.current = offer;
          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          socket.emit("initiateCall", {
            to: remoteUserId,
            callType,
            offer,
            callerInfo: { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar },
          });
          noAnswerTimeoutRef.current = setTimeout(() => { if (callStatus === "calling") handleEndCall(); }, 30000);
        }
      } catch (err) {
        console.error("Error initializing call:", err);
        cleanup();
        dispatch(callEnded());
      }
    };
    initCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus === "idle" ? "idle" : "active"]);

  useEffect(() => {
    if (!socket) return;
    const handleCallAnswered = async ({ answer }: any) => {
      if (peerConnectionRef.current) {
        await setRemoteDescription(peerConnectionRef.current, answer);
        for (const candidate of iceCandidatesQueue.current) await addIceCandidate(peerConnectionRef.current, candidate);
        iceCandidatesQueue.current = [];
        dispatch(callConnected());
        if (noAnswerTimeoutRef.current) clearTimeout(noAnswerTimeoutRef.current);
      }
    };
    const handleIceCandidate = async ({ candidate }: any) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) await addIceCandidate(peerConnectionRef.current, candidate);
      else iceCandidatesQueue.current.push(candidate);
    };
    const handleCallRejected = () => { cleanup(); dispatch(callEnded()); };
    const handleCallEnded = () => { cleanup(); dispatch(callEnded()); };
    const handleUserOffline = () => { cleanup(); dispatch(callEnded()); };
    const handleBusy = () => { cleanup(); dispatch(callEnded()); };
    socket.on("call:answered", handleCallAnswered);
    socket.on("call:ice-candidate", handleIceCandidate);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:ended", handleCallEnded);
    socket.on("call:user-offline", handleUserOffline);
    socket.on("call:busy", handleBusy);
    socket.on("call:cancelled", handleCallEnded);
    return () => {
      socket.off("call:answered");
      socket.off("call:ice-candidate");
      socket.off("call:rejected");
      socket.off("call:ended");
      socket.off("call:user-offline");
      socket.off("call:busy");
      socket.off("call:cancelled");
    };
  }, [socket, cleanup, dispatch]);

  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => { dispatch(updateCallDuration(callDuration + 1)); }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus, callDuration]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => { track.enabled = !isMuted; });
    }
  }, [isMuted]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => { track.enabled = !isCameraOff; });
    }
  }, [isCameraOff]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1a1d21] flex flex-col items-center justify-between font-sans overflow-hidden text-white">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>

      {/* Header Info */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full text-center pt-16 pb-12 z-20 relative"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#1164A3] mb-4 mx-auto backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-[#1164A3] animate-pulse"></span>
           Secure Connection
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
           {remoteUserInfo?.username || "Guest User"}
        </h2>
        
        <div className="flex flex-col items-center">
            <p className="text-gray-400 text-sm font-bold opacity-80 uppercase tracking-widest">
                {callStatus === "calling" && "Calling..."}
                {callStatus === "ringing" && "Ringing..."}
                {callStatus === "connected" && (
                    <span className="text-white text-lg">
                        {formatDuration(callDuration)}
                    </span>
                )}
            </p>
        </div>
      </motion.div>

      {/* Video Content */}
      <div className="flex-1 w-full relative flex items-center justify-center z-10 p-6">
        {callType === "video" ? (
          <div className="w-full h-full max-w-7xl relative mx-auto rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-4xl group">
            {/* Remote video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Local video PIP */}
            <motion.div 
              drag 
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              className="absolute bottom-8 right-8 z-30"
            >
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-40 h-56 md:w-52 md:h-72 object-cover rounded-2xl border-2 border-white/20 shadow-2xl cursor-move bg-black"
                />
            </motion.div>

            {callStatus !== "connected" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1d21]/80 backdrop-blur-xl z-20">
                <div className="text-center">
                    {remoteUserInfo?.avatar ? (
                        <img src={remoteUserInfo.avatar} alt="" className="w-40 h-40 rounded-[2.5rem] mx-auto mb-8 border-4 border-white/10 p-1 bg-black shadow-2xl" />
                    ) : (
                        <div className="w-40 h-40 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto mb-8 border-4 border-white/10">
                        <FaUser size={60} className="text-gray-600" />
                        </div>
                    )}
                    <h3 className="text-2xl font-black mb-2">{remoteUserInfo?.username}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Connecting User...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Voice call */
          <div className="text-center relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative"
            >
                {remoteUserInfo?.avatar ? (
                <img
                    src={remoteUserInfo.avatar}
                    alt=""
                    className={`w-52 h-52 rounded-[3.5rem] mx-auto border-8 shadow-2xl p-1 bg-black transition-all duration-1000 ${
                    callStatus === "connected" ? "border-[#1164A3]/40" : "border-white/5 opacity-40"
                    }`}
                />
                ) : (
                <div
                    className={`w-52 h-52 rounded-[3.5rem] bg-white/5 flex items-center justify-center mx-auto border-8 shadow-2xl transition-all duration-1000 ${
                    callStatus === "connected" ? "border-[#1164A3]/40" : "border-white/5 opacity-40"
                    }`}
                >
                    <FaUser size={70} className="text-gray-700" />
                </div>
                )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Control Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full pb-16 pt-8 z-20 flex flex-col items-center gap-10"
      >
        <div className="bg-[#2c3136] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl flex items-center gap-6">
          <button
                onClick={() => dispatch(toggleMute())}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isMuted ? "bg-red-500 text-white" : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
                }`}
          >
            {isMuted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
          </button>

          {callType === "video" && (
            <button
                    onClick={() => dispatch(toggleCamera())}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    isCameraOff ? "bg-red-500 text-white" : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
                    }`}
            >
                {isCameraOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
            </button>
          )}

          <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-[1.8rem] bg-[#e01e5a] text-white flex items-center justify-center hover:bg-[#c2184e] transition-all shadow-xl hover:scale-105"
          >
            <FaPhoneSlash size={24} />
          </button>

          <button
                onClick={() => dispatch(toggleSpeaker())}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white/10 text-gray-400 hover:text-white hover:bg-white/20`}
          >
            <FaVolumeUp size={20} />
          </button>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
           <FaInfoCircle /> Encrypted End-to-End
        </div>
      </motion.div>
    </div>
  );
};

export default CallScreen;
