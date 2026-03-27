import React, { useEffect, useState, useRef } from "react";
import { FaUser, FaUsers, FaPaperPlane, FaEllipsisV, FaPhone, FaVideo, FaMicrophone, FaStop, FaPaperclip, FaTimes, FaDownload, FaBan, FaTrash, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import type { AppDispatch, RootState } from "../../app/store";
import {
  fetchMessages,
  sendMessage,
  sendFileMessage,
  resetChat,
  deleteMessageThunk,
} from "../../features/chat/chatSlice";
import { startCall } from "../../features/call/callSlice";
import { toast } from "react-toastify";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Magnetic from "../../components/Visuals/Magnetic";

interface ChatUserProps {
  selectedUser: any;
  onBack: () => void;
}

const ChatUser: React.FC<ChatUserProps> = ({ selectedUser, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isLoading, isError, message } = useSelector(
    (state: RootState) => state.chat
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, messageId: string, isSender: boolean } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isDictating, setIsDictating] = useState(false);

  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(fetchMessages({ userId: selectedUser.id, isGroupChat: selectedUser.isGroup }));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetChat());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (isDictating) {
      setInput(transcript);
    }
  }, [transcript, isDictating]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim() && selectedUser?.id) {
      dispatch(sendMessage({ receiver: selectedUser.id, text: input.trim() }));
      setInput("");
      if (isDictating) stopDictation();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleFileSend = () => {
    if (selectedFile && selectedUser?.id) {
      dispatch(sendFileMessage({ receiver: selectedUser.id, file: selectedFile, isGroupChat: selectedUser.isGroup }));
      clearSelectedFile();
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startDictation = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser doesn't support speech recognition.");
      return;
    }
    resetTranscript();
    setIsDictating(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopDictation = () => {
    setIsDictating(false);
    SpeechRecognition.stopListening();
  };

  const startRecording = () => {
    setIsRecording(true);
    // Placeholder for actual audio recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleDeleteMessage = (messageId: string, isSender: boolean) => {
    dispatch(deleteMessageThunk({ messageId, isSender }));
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, msg: any) => {
    e.preventDefault();
    const isSender = getIdString(currentUser?.id) === getIdString(msg.sender);
    setContextMenu({ x: e.clientX, y: e.clientY, messageId: msg._id, isSender });
  };

  const handleTouchStart = (msg: any) => {
    // Basic long press detection for mobile
    const timer = setTimeout(() => {
        const isSender = getIdString(currentUser?.id) === getIdString(msg.sender);
        setContextMenu({ x: window.innerWidth / 2, y: window.innerHeight / 2, messageId: msg._id, isSender });
    }, 500);
    return () => clearTimeout(timer);
  };

  const getIdString = (id: any) => (typeof id === "object" ? id?.$oid || id?.id || id?._id : id);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📽️';
      case 'zip': case 'rar': return '📦';
      default: return '📁';
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const UploadOverlay = ({ msg }: { msg: any }) => (
    msg.uploadStatus === "uploading" && (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
        <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#1164A3] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-[10px] font-bold text-[#1D1C1D]">Uploading...</p>
        </div>
      </div>
    )
  );

  const renderMessageContent = (msg: any, _isMe: boolean) => {
    if (msg.deletedBySender || msg.deletedByReceiver) {
      return (
        <div className="flex items-center gap-2 opacity-60 italic text-sm">
          <FaBan size={12} />
          <span>This message was deleted</span>
        </div>
      );
    }

    const mediaSrc = msg.fileUrl;
    
    switch (msg.messageType) {
      case "image":
        return (
          <div className="max-w-[300px] md:max-w-[360px] relative rounded-xl overflow-hidden shadow-sm border border-[#E2E2E2]">
            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
              <img src={mediaSrc} alt="Image" className={`rounded-xl w-full h-auto object-cover ${msg.uploadStatus === "uploading" ? "opacity-40 grayscale" : "hover:scale-[1.01] transition-transform duration-300"}`} style={{ maxHeight: "300px" }} />
            </a>
            <UploadOverlay msg={msg} />
          </div>
        );
      case "video":
        return (
          <div className="max-w-[300px] md:max-w-[360px] relative rounded-xl overflow-hidden shadow-sm border border-[#E2E2E2]">
            <video controls={!msg.uploadStatus} className={`rounded-xl w-full h-auto ${msg.uploadStatus ? "opacity-40 grayscale" : ""}`} style={{ maxHeight: "300px" }} src={mediaSrc} />
            <UploadOverlay msg={msg} />
          </div>
        );
      case "document":
        return (
          <div className="relative">
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border border-[#E2E2E2] transition-all bg-[#F8F8F8] hover:bg-white`}>
              <span className="text-2xl flex-shrink-0 bg-white p-2 rounded-xl shadow-sm">{getFileIcon(msg.fileName || "")}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-[#1D1C1D]">{msg.fileName}</p>
                <p className="text-[10px] font-medium text-gray-400">{getFileSize(msg.fileSize || 0)}</p>
              </div>
              <a href={msg.fileUrl} download className="p-2 hover:bg-gray-100 rounded-xl transition text-[#1164A3]"><FaDownload size={14} /></a>
            </div>
            <UploadOverlay msg={msg} />
          </div>
        );
      case "call": {
        const isVoice = msg.callType === "voice";
        const isNegative = msg.callStatus !== "completed";
        return (
          <div className={`flex items-center gap-4 py-2 px-1 ${isNegative ? "opacity-60" : ""}`}>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNegative ? "bg-red-50 text-red-600" : "bg-blue-50 text-[#1164A3]"}`}>
                {msg.callType === "voice" ? <FaPhone /> : <FaVideo />}
             </div>
             <div>
                <p className="text-sm font-bold">
                   {isNegative ? (msg.callStatus === "missed" ? "Missed Call" : "Declined") : `${isVoice ? "Voice" : "Video"} Call`}
                </p>
                <p className="text-[10px] font-medium text-gray-500">
                   {msg.callStatus === "completed" ? `Duration: ${formatTime(msg.callDuration || 0)}` : "Unavailable"}
                </p>
             </div>
          </div>
        );
      }
      default:
        return <span className="break-words leading-relaxed font-normal">{msg.text}</span>;
    }
  };

  if (!selectedUser) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-400 p-6 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-[#E2E2E2] shadow-sm">
                <FaUsers size={40} className="text-gray-200"/>
            </div>
            <h2 className="text-2xl font-black text-[#1D1C1D] mb-2 tracking-tight">Channel Idle</h2>
            <p className="text-sm font-medium text-gray-500 max-w-xs">Select a user or channel from the sidebar to start collaborating.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full relative bg-white overflow-hidden font-sans text-[#1D1C1D]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E2E2] z-20 shadow-sm">
        <div className="flex items-center">
            <button onClick={onBack} className="mr-4 p-2 text-gray-400 md:hidden hover:text-[#1D1C1D] transition">
              <FaArrowLeft size={18} />
            </button>

            <div className="relative">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.username} className="w-10 h-10 rounded-lg object-cover mr-3 border border-[#E2E2E2]" />
                ) : (
                  <div className="w-10 h-10 bg-gray-50 rounded-lg mr-3 flex items-center justify-center border border-[#E2E2E2]">
                    <FaUser size={16} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border-2 border-white">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
            </div>
            
            <div>
                 <h2 className="text-base font-black text-[#1D1C1D] leading-tight truncate flex items-center gap-2">
                    {selectedUser.isGroup ? selectedUser.name : (selectedUser.username || selectedUser.name)}
                    {selectedUser.isGroup && <span className="text-gray-300 font-normal italic">#channel</span>}
                 </h2>
                 <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                   User Online
                 </p>
            </div>
        </div>
        <div className="flex gap-1">
            <button onClick={() => dispatch(startCall({ remoteUserId: selectedUser.id, remoteUserInfo: selectedUser, callType: "voice" }))} className="p-3 bg-white hover:bg-gray-50 rounded-lg text-gray-500 hover:text-[#1D1C1D] transition border border-[#E2E2E2]">
                <FaPhone size={16} />
            </button>
            <button onClick={() => dispatch(startCall({ remoteUserId: selectedUser.id, remoteUserInfo: selectedUser, callType: "video" }))} className="p-3 bg-white hover:bg-gray-50 rounded-lg text-gray-500 hover:text-[#1D1C1D] transition border border-[#E2E2E2]">
                <FaVideo size={16} />
            </button>
            <button className="p-3 text-gray-400 hover:text-[#1D1C1D] transition"><FaEllipsisV size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col custom-scrollbar relative z-10 antialiased bg-white">
        <AnimatePresence>
            {isLoading && messages.length === 0 ? (
              <div className="mt-20"><LoadingSpinner size="lg" /></div>
            ) : (
              messages.map((msg: any) => {
                 const isMe = getIdString(currentUser?.id) === getIdString(msg.sender);
                 return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                  onTouchStart={() => handleTouchStart(msg)}
                >
                  <div className={`flex flex-col max-w-[85%] md:max-w-xl ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && <span className="text-[11px] font-black mb-1.5 ml-1 text-gray-600 uppercase tracking-tighter">{selectedUser.username}</span>}
                      <div className={`px-5 py-3 rounded-2xl text-[15px] border transition-all duration-200 ${
                        isMe
                         ? msg.deletedBySender ? "bg-gray-50 border-[#E2E2E2] text-gray-400 italic" : "bg-[#1164A3] border-[#1164A3] text-white rounded-br-none shadow-sm"
                         : msg.deletedBySender ? "bg-gray-50 border-[#E2E2E2] text-gray-400 italic" : "bg-[#F8F8F8] border-[#E2E2E2] text-[#1D1C1D] rounded-bl-none shadow-sm"
                      }`}>
                        {renderMessageContent(msg, isMe)}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 px-1 opacity-60">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                             {msg.uploadStatus === "uploading" ? "Transmitting..." : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                      </div>
                  </div>
                </motion.div>
              )})
            )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-8 pt-2 z-20 bg-white">
         <div className="bg-white border-2 border-[#E2E2E2] rounded-xl p-2.5 shadow-sm relative group focus-within:border-[#1164A3] transition-all">
            {/* Context Menu Overlay */}
            {contextMenu && (
                <div ref={contextMenuRef} className="fixed z-50 bg-white rounded-xl shadow-2xl border border-[#E2E2E2] py-2 min-w-[180px]" style={{ left: contextMenu.x, top: contextMenu.y - 100 }}>
                    <button onClick={() => handleDeleteMessage(contextMenu.messageId, contextMenu.isSender)} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition text-left">
                        <FaTrash size={12} /> <span>Delete Message</span>
                    </button>
                    <button onClick={() => setContextMenu(null)} className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition text-left">
                        <FaTimes size={12} /> <span>Dismiss</span>
                    </button>
                </div>
            )}

            {isDictating && <div className="absolute -top-10 left-4 bg-[#1164A3] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-bounce shadow-lg">Listening...</div>}

            <div className="flex items-center gap-1.5">
                <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-[#1164A3] hover:bg-gray-50 rounded-lg transition"><FaPaperclip size={18} /></button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" />

                <button onClick={startDictation} className={`p-3 rounded-lg transition ${isDictating ? "bg-blue-50 text-[#1164A3] animate-pulse" : "text-gray-400 hover:text-[#1164A3] hover:bg-gray-50"}`}><FaMicrophone size={18} /></button>

                <div className="flex-1 bg-white rounded-lg flex items-center px-4">
                    <input
                        type="text"
                        placeholder={isDictating ? "Speak your message..." : `Message ${selectedUser.name || selectedUser.username}...`}
                        className="w-full bg-transparent py-3.5 outline-none text-[#1D1C1D] placeholder-gray-400 text-sm font-medium"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                    />
                </div>

                <Magnetic>
                    <button onClick={isRecording ? stopRecording : (input.trim() ? handleSend : startRecording)} className={`w-11 h-11 rounded-lg flex items-center justify-center transition flex-shrink-0 ${isRecording ? "bg-red-500 text-white" : "bg-[#1164A3] text-white hover:bg-[#0b4d7e]"}`}>
                        {isRecording ? <FaStop /> : (input.trim() ? <FaPaperPlane size={14} className="ml-0.5" /> : <FaMicrophone size={16} />)}
                    </button>
                </Magnetic>
            </div>

            {/* File Preview */}
            {selectedFile && (
                <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-2.5 px-3 pb-2 pt-2 border-t border-[#E2E2E2] flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-[#E2E2E2]">
                        {filePreviewUrl ? <img src={filePreviewUrl} className="w-8 h-8 rounded-md object-cover" /> : <span className="text-lg">{getFileIcon(selectedFile.name)}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#1D1C1D] truncate">{selectedFile.name}</p>
                        <p className="text-[9px] font-medium text-gray-500">{getFileSize(selectedFile.size)}</p>
                    </div>
                    <button onClick={clearSelectedFile} className="p-2 text-gray-400 hover:text-red-500 transition"><FaTimes size={14} /></button>
                    <button onClick={handleFileSend} className="p-2.5 bg-[#1164A3] text-white rounded-lg hover:bg-[#0b4d7e] transition"><FaPaperPlane size={14} /></button>
                </motion.div>
            )}
         </div>
         <div className="mt-3 flex items-center gap-4 px-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <FaInfoCircle /> End-to-End Encrypted
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                iVoice Protocol Secure
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatUser;
