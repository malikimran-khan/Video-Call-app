import React, { useState } from "react";
import Alluser from "./Alluser";
import ChatUser from "./ChatUser";

const ChatApp: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
        {/* Left Sidebar - Hidden on mobile if a user is selected */}
        <div className={`w-full md:w-80 h-full ${selectedUser ? "hidden md:flex" : "flex"}`}>
            <Alluser
              onSelectUser={(user) => setSelectedUser(user)}
              selectedUserId={selectedUser?.id || null}
            />
        </div>

        {/* Chat Area - Hidden on mobile if no user is selected */}
        <div className={`flex-1 flex flex-col bg-slate-50 relative h-full ${!selectedUser ? "hidden md:flex" : "flex"}`}>
          <ChatUser 
            selectedUser={selectedUser} 
            onBack={() => setSelectedUser(null)} 
          />
        </div>
    </div>
  );
};

export default ChatApp;
