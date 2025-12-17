import React, { useState } from "react";
import Alluser from "./Alluser";
import ChatUser from "./ChatUser";

const ChatApp: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Left Sidebar */}
        <Alluser
          onSelectUser={(user) => setSelectedUser(user)}
          selectedUserId={selectedUser?.id || null}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          <ChatUser selectedUser={selectedUser} />
        </div>
    </div>
  );
};

export default ChatApp;
