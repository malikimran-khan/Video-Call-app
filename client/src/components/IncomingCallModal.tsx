import React, { useEffect } from "react";
import { FaPhone, FaPhoneSlash, FaUser, FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { callEnded } from "../features/call/callSlice";
import {
  createPeerConnection,
  createAnswer,
  setRemoteDescription,
  getMediaStream,
} from "../utils/webrtcUtils";
import type { Socket } from "socket.io-client";

interface IncomingCallModalProps {
  socket: Socket | null;
  incomingOffer: RTCSessionDescriptionInit | null;
  onAccept: (pc: RTCPeerConnection, stream: MediaStream) => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  socket,
  incomingOffer,
  onAccept,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { callStatus, callType, remoteUserId, remoteUserInfo } = useSelector(
    (state: RootState) => state.call
  );

  // Play ringtone effect
  useEffect(() => {
    if (callStatus === "ringing") {
      // Create a simple oscillator ringtone
      try {
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.1;
        osc.type = "sine";

        // Ring pattern
        let ringCount = 0;
        const ringInterval = setInterval(() => {
          if (ringCount % 2 === 0) {
            gain.gain.value = 0.1;
          } else {
            gain.gain.value = 0;
          }
          ringCount++;
        }, 500);

        osc.start();

        return () => {
          clearInterval(ringInterval);
          osc.stop();
          audioCtx.close();
        };
      } catch (e) {
        // Audio context may not be available
      }
    }
  }, [callStatus]);

  const handleAccept = async () => {
    if (!socket || !remoteUserId || !incomingOffer || !callType) return;

    try {
      const stream = await getMediaStream(callType);

      const pc = createPeerConnection(
        (candidate) => {
          socket.emit("call:ice-candidate", { to: remoteUserId, candidate });
        },
        () => {},
        () => {}
      );

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await setRemoteDescription(pc, incomingOffer);
      const answer = await createAnswer(pc);

      socket.emit("call:answer", { to: remoteUserId, answer });

      onAccept(pc, stream);
    } catch (err) {
      console.error("Error accepting call:", err);
      alert("Could not access camera/microphone.");
      dispatch(callEnded());
    }
  };

  const handleReject = () => {
    if (socket && remoteUserId) {
      socket.emit("call:reject", { to: remoteUserId, callType });
    }
    dispatch(callEnded());
  };

  if (callStatus !== "ringing") return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 w-[340px] shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-300">
        {/* Caller Info */}
        <div className="mb-6">
          <div className="relative inline-block mb-4">
            {remoteUserInfo?.avatar ? (
              <img
                src={remoteUserInfo.avatar}
                alt=""
                className="w-24 h-24 rounded-full border-3 border-green-400 shadow-lg shadow-green-400/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center border-3 border-green-400 shadow-lg shadow-green-400/20">
                <FaUser size={36} className="text-gray-300" />
              </div>
            )}
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-40" />
          </div>
          <h3 className="text-white text-xl font-bold">{remoteUserInfo?.username || "Unknown"}</h3>
          <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1.5">
            {callType === "video" ? <FaVideo size={12} /> : <FaPhone size={12} />}
            Incoming {callType} call...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8">
          {/* Decline */}
          <div className="text-center">
            <button
              onClick={handleReject}
              className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 hover:scale-105 mx-auto"
            >
              <FaPhoneSlash size={24} />
            </button>
            <span className="text-gray-400 text-xs mt-2 block">Decline</span>
          </div>
          
          {/* Accept */}
          <div className="text-center">
            <button
              onClick={handleAccept}
              className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 hover:scale-105 mx-auto animate-bounce"
            >
              <FaPhone size={24} />
            </button>
            <span className="text-gray-400 text-xs mt-2 block">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
