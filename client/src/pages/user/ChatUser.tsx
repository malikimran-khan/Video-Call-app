import React, { useEffect, useState, useRef } from "react";
import { FaUser, FaPaperPlane, FaEllipsisV, FaPhone, FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchMessages, sendMessage, resetChat, addMessage } from "../../features/chat/chatSlice";
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

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: any) => {
        if (selectedUser && newMessage.sender === selectedUser.id) {
           dispatch(addMessage(newMessage));
        }
      });

      return () => {
        socket.off("newMessage");
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
          <p className="text-center text-gray-400 p-4">Loading messages...</p>
        ) : (
          messages.map((msg) => {
             const senderId = currentUser?.id;
             const isMe = String(msg.sender) === String(senderId);
             return (
            <div
              key={msg._id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col max-w-[85%] md:max-w-lg shadow-sm ${
                    isMe ? "items-end" : "items-start"
                }`}
              >
                  <div className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl text-sm md:text-base ${
                    isMe
                     ? "bg-black text-white rounded-br-none"
                     : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
              </div>
            </div>
          )})
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-200">
         <div className="flex items-center gap-2 bg-gray-100 px-3 md:px-4 py-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-gray-800 placeholder-gray-500"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <FaPaperPlane size={14} className="-ml-0.5 mt-0.5" />
            </button>
         </div>
         <div className="hidden md:block text-center mt-2 text-[10px] text-gray-400">
            Press Enter to send
         </div>
      </div>
    </div>
  );
};

export default ChatUser;
