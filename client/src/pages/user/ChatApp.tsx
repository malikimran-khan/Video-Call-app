import React, { useState } from "react";
import Alluser from "./Alluser";
import ChatUser from "./ChatUser";

const ChatApp: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-[#1D1C1D]">
      {/* Sidebar - Deep Slate/Purple for Slack Feel */}
      <div className={`
        ${selectedUser ? 'hidden md:flex' : 'flex'} 
        w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-[#E2E2E2] bg-[#19171D]
      `}>
         <Alluser onSelectUser={setSelectedUser} selectedUserId={selectedUser?.id} />
      </div>

      {/* Main Chat Area - Clean White */}
      <div className={`
        ${!selectedUser ? 'hidden md:flex' : 'flex'} 
        flex-1 bg-white relative
      `}>
          <ChatUser 
            selectedUser={selectedUser} 
            onBack={() => setSelectedUser(null)} 
          />
      </div>
    </div>
  );
};

export default ChatApp;
