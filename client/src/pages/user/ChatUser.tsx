import React, { useEffect, useState, useRef } from "react";
import { FaUser, FaPaperPlane, FaEllipsisV, FaPhone, FaVideo, FaMicrophone, FaStop, FaPaperclip, FaTimes, FaDownload, FaRedo, FaBan, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import {
  fetchMessages,
  sendMessage,
  resetChat,
  addMessage,
  sendVoiceMessage,
  sendFileMessage,
  addOptimisticMessage,
  updateOptimisticMessage,
  failOptimisticMessage,
  removeOptimisticMessage,
  deleteMessageThunk,
  markMessageDeletedBySender,
  removeMessageLocally,
} from "../../features/chat/chatSlice";
import type { IMessage } from "../../features/chat/chatTypes";
import { io } from "socket.io-client";

interface ChatUserProps {
  selectedUser: any | null;
  onBack?: () => void;
}

const ChatUser: React.FC<ChatUserProps> = ({ selectedUser, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isLoading } = useSelector((state: RootState) => state.chat);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<any>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<any>(null);

  // File attachment states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Abort controllers for cancelling uploads
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Context menu state for delete
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; messageId: string; isSender: boolean } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Helper to extract a clean string ID from any format (string, object with _id/id, or ObjectId)
  const getIdString = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (val._id) return getIdString(val._id);
    if (val.id) return getIdString(val.id);
    if (val.$oid) return String(val.$oid);
    if (typeof val.toString === "function") return val.toString();
    return String(val);
  };

  // Long press state for mobile
  const longPressTimerRef = useRef<any>(null);

  // Initialize Socket.io
  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:5000", {
        query: {
          userId: currentUser.id,
        },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  // Listen for incoming messages + delete events
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: any) => {
        if (selectedUser && newMessage.sender === selectedUser.id) {
           dispatch(addMessage(newMessage));
        }
      });

      // Listen for message deleted by the other user (sender)
      socket.on("messageDeleted", (data: { messageId: string; deletedBySender: boolean }) => {
        if (data.deletedBySender) {
          dispatch(markMessageDeletedBySender(data.messageId));
        }
      });

      return () => {
        socket.off("newMessage");
        socket.off("messageDeleted");
      };
    }
  }, [socket, selectedUser, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages(selectedUser.id));
    }
    return () => {
      dispatch(resetChat());
    };
  }, [selectedUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up file preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach((c) => c.abort());
      abortControllersRef.current.clear();
    };
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser || !currentUser) return;
    
    dispatch(
      sendMessage({
        receiver: selectedUser.id,
        text: input,
      })
    );
    setInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }

    // Reset file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine message type from MIME type
  const getMessageTypeFromFile = (file: File): IMessage["messageType"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const handleFileSend = async () => {
    if (!selectedFile || !selectedUser || !currentUser) return;

    const file = selectedFile;
    const tempId = "temp-" + Date.now();
    const messageType = getMessageTypeFromFile(file);

    // Create local preview URL for images/videos
    let localPreviewUrl: string | undefined;
    if (messageType === "image" || messageType === "video") {
      localPreviewUrl = URL.createObjectURL(file);
    }

    // 1. Dispatch optimistic message → appears instantly in chat
    const optimisticMsg: IMessage = {
      _id: tempId,
      sender: currentUser.id,
      receiver: selectedUser.id,
      messageType,
      fileName: file.name,
      createdAt: new Date().toISOString(),
      uploadStatus: "uploading",
      localPreviewUrl,
    };
    dispatch(addOptimisticMessage(optimisticMsg));

    // 2. Clear file selection bar
    clearSelectedFile();

    // 3. Upload in background
    try {
      const result = await dispatch(
        sendFileMessage({ receiver: selectedUser.id, file })
      ).unwrap();

      // 4. On success → replace temp with real message
      dispatch(updateOptimisticMessage({ tempId, realMessage: result }));

      // Revoke the local preview URL
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    } catch (err) {
      console.error("File upload failed:", err);
      // 5. On failure → mark as failed
      dispatch(failOptimisticMessage(tempId));
    }
  };

  const handleVoiceSendOptimistic = (audioBlob: Blob) => {
    if (!selectedUser || !currentUser) return;

    const tempId = "temp-voice-" + Date.now();
    const localPreviewUrl = URL.createObjectURL(audioBlob);

    // 1. Dispatch optimistic message
    const optimisticMsg: IMessage = {
      _id: tempId,
      sender: currentUser.id,
      receiver: selectedUser.id,
      messageType: "voice",
      createdAt: new Date().toISOString(),
      uploadStatus: "uploading",
      localPreviewUrl,
    };
    dispatch(addOptimisticMessage(optimisticMsg));

    // 2. Upload in background
    dispatch(sendVoiceMessage({ receiver: selectedUser.id, audio: audioBlob }))
      .unwrap()
      .then((result) => {
        dispatch(updateOptimisticMessage({ tempId, realMessage: result }));
        URL.revokeObjectURL(localPreviewUrl);
      })
      .catch((err) => {
        console.error("Voice upload failed:", err);
        dispatch(failOptimisticMessage(tempId));
      });
  };

  // Retry a failed upload
  const handleRetry = (msg: IMessage) => {
    dispatch(removeOptimisticMessage(msg._id));
  };

  const handleCancelUpload = (tempId: string) => {
    const controller = abortControllersRef.current.get(tempId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(tempId);
    }
    dispatch(removeOptimisticMessage(tempId));
  };

  // ===== DELETE MESSAGE =====
  const handleDeleteMessage = (messageId: string, isSender: boolean) => {
    setContextMenu(null);
    dispatch(deleteMessageThunk({ messageId, isSender }));
  };

  // Right-click context menu handler
  const handleContextMenu = (e: React.MouseEvent, msg: IMessage) => {
    // Don't show menu for temp/uploading messages or already deleted messages
    if (msg._id.startsWith("temp-") || msg.uploadStatus || msg.deletedBySender) return;

    e.preventDefault();
    const isSender = getIdString(msg.sender) === getIdString(currentUser?.id);

    // Calculate position relative to viewport, keeping menu in bounds
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 120);

    setContextMenu({ x, y, messageId: msg._id, isSender });
  };

  // Long press handlers for mobile
  const handleTouchStart = (msg: IMessage) => {
    if (msg._id.startsWith("temp-") || msg.uploadStatus || msg.deletedBySender) return;

    longPressTimerRef.current = setTimeout(() => {
      const isSender = getIdString(msg.sender) === getIdString(currentUser?.id);
      // Show context menu in center of screen on mobile
      setContextMenu({
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 60,
        messageId: msg._id,
        isSender,
      });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";
    if (["ppt", "pptx"].includes(ext)) return "📽️";
    if (["txt"].includes(ext)) return "📃";
    return "📎";
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        if (selectedUser) {
          handleVoiceSendOptimistic(audioBlob);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Upload overlay component — circular spinner + cancel / retry
  const UploadOverlay: React.FC<{ msg: IMessage }> = ({ msg }) => {
    if (!msg.uploadStatus) return null;

    if (msg.uploadStatus === "uploading") {
      return (
        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center z-10 backdrop-blur-[1px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelUpload(msg._id);
            }}
            className="relative w-12 h-12 flex items-center justify-center group"
            title="Cancel upload"
          >
            {/* Spinning ring */}
            <svg className="absolute inset-0 w-12 h-12 animate-spin" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="62.8 62.8"
                strokeLinecap="round"
              />
            </svg>
            {/* X icon in center */}
            <FaTimes size={14} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      );
    }

    if (msg.uploadStatus === "failed") {
      return (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center z-10 gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRetry(msg);
            }}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg"
            title="Upload failed — tap to remove"
          >
            <FaRedo size={14} className="text-white" />
          </button>
          <span className="text-white text-[10px] font-medium drop-shadow">Failed</span>
        </div>
      );
    }

    return null;
  };

  // Render deleted message placeholder
  const renderDeletedMessage = (isMe: boolean) => {
    return (
      <div className="flex items-center gap-2 py-0.5">
        <FaBan size={12} className={`${isMe ? "text-gray-400" : "text-gray-400"} flex-shrink-0`} />
        <span className={`text-sm italic ${isMe ? "text-gray-400" : "text-gray-400"}`}>
          This message was deleted
        </span>
      </div>
    );
  };

  // Render message content based on type
  const renderMessageContent = (msg: IMessage, isMe: boolean) => {
    // If message was deleted by sender, show deleted placeholder
    if (msg.deletedBySender) {
      return renderDeletedMessage(isMe);
    }

    // Determine the image/video source: use local preview if uploading, otherwise the server URL
    const mediaSrc = msg.localPreviewUrl || msg.fileUrl;

    switch (msg.messageType) {
      case "voice":
        return (
          <div className="flex items-center gap-2 min-w-[200px] relative">
            {msg.uploadStatus === "uploading" ? (
              <div className="flex items-center gap-2 py-1 w-full">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                <span className={`text-xs ${isMe ? "text-gray-300" : "text-gray-500"}`}>Sending voice note...</span>
                <button
                  onClick={() => handleCancelUpload(msg._id)}
                  className="ml-auto p-1 text-gray-400 hover:text-red-400 transition flex-shrink-0"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : msg.uploadStatus === "failed" ? (
              <div className="flex items-center gap-2 py-1 w-full">
                <span className="text-xs text-red-400">Failed to send</span>
                <button
                  onClick={() => handleRetry(msg)}
                  className="ml-auto p-1 text-red-400 hover:text-red-300 transition flex-shrink-0"
                >
                  <FaRedo size={12} />
                </button>
              </div>
            ) : (
              <audio controls className={`h-8 ${isMe ? "invert brightness-0" : ""}`}>
                <source src={msg.fileUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        );

      case "image":
        return (
          <div className="max-w-[280px] md:max-w-[320px] relative">
            <a
              href={msg.uploadStatus ? undefined : msg.fileUrl}
              target={msg.uploadStatus ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={msg.uploadStatus ? "pointer-events-auto" : ""}
            >
              <img
                src={mediaSrc}
                alt={msg.fileName || "Image"}
                className={`rounded-lg w-full h-auto object-cover transition ${
                  msg.uploadStatus === "uploading" ? "opacity-70" : msg.uploadStatus === "failed" ? "opacity-50" : "cursor-pointer hover:opacity-90"
                }`}
                style={{ maxHeight: "300px" }}
                loading="lazy"
              />
            </a>
            <UploadOverlay msg={msg} />
          </div>
        );

      case "video":
        return (
          <div className="max-w-[300px] md:max-w-[360px] relative">
            {msg.uploadStatus ? (
              <>
                {mediaSrc ? (
                  <video
                    className={`rounded-lg w-full h-auto ${msg.uploadStatus === "uploading" ? "opacity-70" : "opacity-50"}`}
                    style={{ maxHeight: "300px" }}
                    preload="metadata"
                    muted
                  >
                    <source src={mediaSrc} />
                  </video>
                ) : (
                  <div className="w-full h-[200px] bg-gray-800 rounded-lg flex items-center justify-center">
                    <FaVideo size={30} className="text-gray-500" />
                  </div>
                )}
                <UploadOverlay msg={msg} />
              </>
            ) : (
              <video
                controls
                className="rounded-lg w-full h-auto"
                style={{ maxHeight: "300px" }}
                preload="metadata"
              >
                <source src={msg.fileUrl} />
                Your browser does not support the video element.
              </video>
            )}
          </div>
        );

      case "document":
        return (
          <div className="relative">
            <a
              href={msg.uploadStatus ? undefined : msg.fileUrl}
              target={msg.uploadStatus ? undefined : "_blank"}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg min-w-[200px] transition ${
                isMe
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } ${msg.uploadStatus === "uploading" ? "opacity-70" : ""} ${msg.uploadStatus === "failed" ? "opacity-50" : ""}`}
            >
              <span className="text-2xl flex-shrink-0">{getFileIcon(msg.fileName || "")}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isMe ? "text-white" : "text-gray-800"}`}>
                  {msg.fileName || "Document"}
                </p>
                <p className={`text-[10px] ${isMe ? "text-gray-300" : "text-gray-500"}`}>
                  {msg.uploadStatus === "uploading" ? "Uploading..." : msg.uploadStatus === "failed" ? "Failed" : "Tap to open"}
                </p>
              </div>
              {msg.uploadStatus === "uploading" ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancelUpload(msg._id);
                  }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center relative"
                >
                  <svg className="absolute inset-0 w-8 h-8 animate-spin" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke={isMe ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} strokeWidth="2.5" />
                    <circle cx="16" cy="16" r="13" fill="none" stroke={isMe ? "white" : "#333"} strokeWidth="2.5" strokeDasharray="41 41" strokeLinecap="round" />
                  </svg>
                  <FaTimes size={10} className={`relative z-10 ${isMe ? "text-white" : "text-gray-600"}`} />
                </button>
              ) : msg.uploadStatus === "failed" ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRetry(msg);
                  }}
                  className="flex-shrink-0"
                >
                  <FaRedo size={14} className="text-red-400" />
                </button>
              ) : (
                <FaDownload size={14} className={`flex-shrink-0 ${isMe ? "text-gray-300" : "text-gray-500"}`} />
              )}
            </a>
          </div>
        );

      default:
        return msg.text;
    }
  };

  if (!selectedUser) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaUser size={30} className="md:size-40 text-gray-400"/>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">No Chat Selected</h2>
            <p className="text-xs md:text-sm">Select a user from the sidebar to start a conversation.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full relative bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="flex items-center">
            {/* Back Button for mobile */}
            <button 
              onClick={onBack}
              className="mr-3 p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {selectedUser.avatar ? (
                 <img src={selectedUser.avatar} alt={selectedUser.username} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover mr-3 border border-gray-200" />
            ) : (
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 rounded-full mr-3 flex items-center justify-center">
                     <FaUser size={16} className="md:size-18 text-gray-400" />
                </div>
            )}
            <div>
                 <h2 className="text-sm md:text-base font-bold text-gray-900 leading-tight truncate max-w-[120px] md:max-w-none">{selectedUser.username}</h2>
                 <p className="text-[10px] md:text-xs text-green-500 font-medium">Online</p>
            </div>
        </div>
        <div className="flex gap-2 md:gap-4 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 md:text-gray-400 transition"><FaPhone size={18} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 md:text-gray-400 transition"><FaVideo size={18} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 md:text-gray-400 transition"><FaEllipsisV size={18} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col custom-scrollbar bg-slate-50">
        {isLoading && messages.length === 0 ? (
          <LoadingSpinner size="md" label="Loading messages..." />
        ) : (
          messages.map((msg) => {
             const myId = getIdString(currentUser?.id);
             const msgSenderId = getIdString(msg.sender);
             const isMe = myId !== "" && msgSenderId !== "" && myId === msgSenderId;
             return (
            <div
              key={msg._id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
              onContextMenu={(e) => handleContextMenu(e, msg)}
              onTouchStart={() => handleTouchStart(msg)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
            >
              <div
                className={`flex flex-col max-w-[85%] md:max-w-lg shadow-sm ${
                    isMe ? "items-end" : "items-start"
                }`}
              >
                  <div className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl text-sm md:text-base ${
                    isMe
                     ? msg.deletedBySender ? "bg-gray-700 text-gray-400 rounded-br-none" : "bg-black text-white rounded-br-none"
                     : msg.deletedBySender ? "bg-gray-100 text-gray-400 border border-gray-100 rounded-bl-none" : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  } ${(msg.messageType === "image" || msg.messageType === "video") && !msg.deletedBySender ? "!p-1.5" : ""}`}>
                    {renderMessageContent(msg, isMe)}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {msg.uploadStatus === "uploading" ? (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 animate-spin" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="19 19" strokeLinecap="round" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      )}
                  </span>
              </div>
            </div>
          )})
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Menu for Delete */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-150"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.isSender ? (
            // Sender: Delete for everyone
            <button
              onClick={() => handleDeleteMessage(contextMenu.messageId, true)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <FaTrash size={13} />
              <span>Delete for everyone</span>
            </button>
          ) : (
            // Receiver: Delete for me only
            <button
              onClick={() => handleDeleteMessage(contextMenu.messageId, false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <FaTrash size={13} />
              <span>Delete for me</span>
            </button>
          )}
          {/* Cancel */}
          <button
            onClick={() => setContextMenu(null)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            <FaTimes size={13} />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* File Preview Bar */}
      {selectedFile && (
        <div className="px-3 md:px-4 pt-3 pb-1 bg-white border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
            {/* Preview thumbnail */}
            {filePreviewUrl ? (
              <img src={filePreviewUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            ) : selectedFile.type.startsWith("video/") ? (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FaVideo size={20} className="text-gray-500" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{getFileIcon(selectedFile.name)}</span>
              </div>
            )}
            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{getFileSize(selectedFile.size)}</p>
            </div>
            {/* Actions */}
            <button
              onClick={clearSelectedFile}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition flex-shrink-0"
            >
              <FaTimes size={14} />
            </button>
            <button
              onClick={handleFileSend}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition flex-shrink-0"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        className="hidden"
      />

      {/* Input */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-200">
         <div className="flex items-center gap-2 bg-gray-100 px-3 md:px-4 py-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all shadow-sm">
            {isRecording ? (
              <div className="flex-1 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Recording... {formatTime(recordingTime)}</span>
                </div>
                <button 
                  onClick={stopRecording}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                >
                  <FaStop size={12} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-gray-800 placeholder-gray-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={!!selectedFile}
                />
                <div className="flex items-center gap-1">
                   {!input.trim() && !selectedFile && (
                     <>
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         className="p-2 text-gray-500 hover:text-black transition"
                         title="Attach file"
                       >
                         <FaPaperclip size={18} />
                       </button>
                       <button
                         onClick={startRecording}
                         className="p-2 text-gray-500 hover:text-black transition"
                       >
                         <FaMicrophone size={18} />
                       </button>
                     </>
                   )}
                   {!selectedFile && (
                     <button
                       onClick={handleSend}
                       disabled={!input.trim()}
                       className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                     >
                       <FaPaperPlane size={14} className="-ml-0.5 mt-0.5" />
                     </button>
                   )}
                </div>
              </>
            )}
         </div>
         <div className="hidden md:block text-center mt-2 text-[10px] text-gray-400">
            {isRecording ? "Stop recording to send" : selectedFile ? "Send or cancel the selected file" : "Press Enter to send"}
         </div>
      </div>
    </div>
  );
};

export default ChatUser;
