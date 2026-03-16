import React, { useEffect, useRef, useCallback } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaVolumeUp, FaUser } from "react-icons/fa";
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

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup everything
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

  // Handle end call
  const handleEndCall = useCallback(() => {
    if (socket && remoteUserId) {
      if (callStatus === "calling") {
        // No answer timeout — caller cancels
        socket.emit("call:no-answer", { to: remoteUserId, callType });
      } else {
        socket.emit("call:end", { to: remoteUserId, callType });
      }
    }
    cleanup();
    dispatch(callEnded());
  }, [socket, remoteUserId, callStatus, callType, cleanup, dispatch]);

  // Initialize call when callStatus changes from idle
  useEffect(() => {
    if (callStatus === "idle" || !socket || !remoteUserId || !callType) return;

    const initCall = async () => {
      try {
        // Get media stream
        const stream = await getMediaStream(callType);
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const pc = createPeerConnection(
          // ICE candidate handler
          (candidate) => {
            socket.emit("call:ice-candidate", { to: remoteUserId, candidate });
          },
          // On remote track
          (remoteStream) => {
            remoteStreamRef.current = remoteStream;
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          },
          // Connection state change
          (state) => {
            if (state === "connected") {
              dispatch(callConnected());
            } else if (state === "disconnected" || state === "failed") {
              handleEndCall();
            }
          }
        );

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        peerConnectionRef.current = pc;

        // If caller, create and send offer
        if (isCaller) {
          const offer = await createOffer(pc);
          offerRef.current = offer;

          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          socket.emit("call:initiate", {
            to: remoteUserId,
            callType,
            offer,
            callerInfo: {
              id: currentUser.id,
              username: currentUser.username,
              avatar: currentUser.avatar,
            },
          });

          // 30s no-answer timeout
          noAnswerTimeoutRef.current = setTimeout(() => {
            if (callStatus === "calling") {
              handleEndCall();
            }
          }, 30000);
        }
      } catch (err) {
        console.error("Error initializing call:", err);
        alert("Could not access camera/microphone. Please check permissions.");
        cleanup();
        dispatch(callEnded());
      }
    };

    initCall();

    return () => {
      // Don't cleanup on re-render, only on unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus === "idle" ? "idle" : "active"]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleCallAnswered = async ({ answer }: any) => {
      if (peerConnectionRef.current) {
        await setRemoteDescription(peerConnectionRef.current, answer);
        // Process queued ICE candidates
        for (const candidate of iceCandidatesQueue.current) {
          await addIceCandidate(peerConnectionRef.current, candidate);
        }
        iceCandidatesQueue.current = [];
        dispatch(callConnected());
        if (noAnswerTimeoutRef.current) clearTimeout(noAnswerTimeoutRef.current);
      }
    };

    const handleIceCandidate = async ({ candidate }: any) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        await addIceCandidate(peerConnectionRef.current, candidate);
      } else {
        iceCandidatesQueue.current.push(candidate);
      }
    };

    const handleCallRejected = () => {
      cleanup();
      dispatch(callEnded());
    };

    const handleCallEnded = () => {
      cleanup();
      dispatch(callEnded());
    };

    const handleUserOffline = () => {
      alert("User is offline");
      cleanup();
      dispatch(callEnded());
    };

    const handleBusy = () => {
      alert("User is busy on another call");
      cleanup();
      dispatch(callEnded());
    };

    socket.on("call:answered", handleCallAnswered);
    socket.on("call:ice-candidate", handleIceCandidate);
    socket.on("call:rejected", handleCallRejected);
    socket.on("call:ended", handleCallEnded);
    socket.on("call:user-offline", handleUserOffline);
    socket.on("call:busy", handleBusy);
    socket.on("call:cancelled", handleCallEnded);

    return () => {
      socket.off("call:answered", handleCallAnswered);
      socket.off("call:ice-candidate", handleIceCandidate);
      socket.off("call:rejected", handleCallRejected);
      socket.off("call:ended", handleCallEnded);
      socket.off("call:user-offline", handleUserOffline);
      socket.off("call:busy", handleBusy);
      socket.off("call:cancelled", handleCallEnded);
    };
  }, [socket, cleanup, dispatch]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => {
        dispatch(updateCallDuration(callDuration + 1));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus, callDuration]);

  // Toggle mute handler
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Toggle camera handler
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOff;
      });
    }
  }, [isCameraOff]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full text-center pt-12 pb-6">
        <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
          {callType === "video" ? "Video Call" : "Voice Call"}
        </p>
        <h2 className="text-white text-2xl font-bold">{remoteUserInfo?.username || "Unknown"}</h2>
        <p className="text-gray-300 text-sm mt-2 animate-pulse">
          {callStatus === "calling" && "Calling..."}
          {callStatus === "ringing" && "Ringing..."}
          {callStatus === "connected" && formatDuration(callDuration)}
        </p>
      </div>

      {/* Video area */}
      <div className="flex-1 w-full relative flex items-center justify-center">
        {callType === "video" ? (
          <>
            {/* Remote video - full screen */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Local video - picture-in-picture */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-4 right-4 w-32 h-44 md:w-40 md:h-56 object-cover rounded-2xl border-2 border-white/30 shadow-xl z-10"
            />
            {callStatus !== "connected" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-5">
                <div className="text-center">
                  {remoteUserInfo?.avatar ? (
                    <img src={remoteUserInfo.avatar} alt="" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-2xl" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mx-auto mb-4 border-4 border-white/20 shadow-2xl">
                      <FaUser size={40} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Voice call - avatar display */
          <div className="text-center">
            {remoteUserInfo?.avatar ? (
              <img
                src={remoteUserInfo.avatar}
                alt=""
                className={`w-36 h-36 rounded-full mx-auto border-4 shadow-2xl ${
                  callStatus === "connected"
                    ? "border-green-400 shadow-green-400/30"
                    : "border-white/30 animate-pulse"
                }`}
              />
            ) : (
              <div
                className={`w-36 h-36 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mx-auto border-4 shadow-2xl ${
                  callStatus === "connected"
                    ? "border-green-400 shadow-green-400/30"
                    : "border-white/30 animate-pulse"
                }`}
              >
                <FaUser size={50} className="text-gray-300" />
              </div>
            )}
            {callStatus === "calling" && (
              <div className="mt-6 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full pb-12 pt-6">
        <div className="flex justify-center items-center gap-5">
          {/* Mute */}
          <button
            onClick={() => dispatch(toggleMute())}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isMuted ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isMuted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
          </button>

          {/* Camera (video calls only) */}
          {callType === "video" && (
            <button
              onClick={() => dispatch(toggleCamera())}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isCameraOff ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isCameraOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
            </button>
          )}

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 hover:scale-105"
          >
            <FaPhoneSlash size={24} />
          </button>

          {/* Speaker */}
          <button
            onClick={() => dispatch(toggleSpeaker())}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
              false ? "bg-blue-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <FaVolumeUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallScreen;
