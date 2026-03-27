import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchUsers } from "../../features/user/userSlice";
import { fetchMyGroups } from "../../features/group/groupSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FaUser, FaUsers, FaPlus, FaSignOutAlt, FaCog, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../features/auth/authSlice";

interface AlluserProps {
  onSelectUser: (user: any) => void;
  selectedUserId?: string;
}

const Alluser: React.FC<AlluserProps> = ({ onSelectUser, selectedUserId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, isLoading: usersLoading } = useSelector((state: RootState) => state.users);
  const { groups, isLoading: groupsLoading } = useSelector((state: RootState) => state.groups);
  const { user } = useSelector((state: RootState) => state.auth);
  const isLoading = usersLoading || groupsLoading;
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMyGroups());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#19171D] text-[#D1D2D3] font-sans border-r border-white/5">
      {/* Workspace Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center font-black text-white text-lg">
             {user?.username?.[0]?.toUpperCase() || "V"}
          </div>
          <div>
            <h1 className="text-sm font-black text-white truncate max-w-[120px]">iVoice Workspace</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               <FaCircle className="text-emerald-500 text-[6px]" />
               <span className="text-[10px] font-bold text-gray-400 capitalize">{user?.username}</span>
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/profile")} className="p-2 text-gray-500 hover:text-white transition rounded-lg hover:bg-white/5">
          <FaCog size={16} />
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex p-1 mx-4 mt-6 bg-black/20 rounded-lg">
        <button 
          onClick={() => setActiveTab("users")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[11px] font-black uppercase tracking-widest rounded-md transition ${activeTab === "users" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}
        >
          <FaUser size={10} /> Users
        </button>
        <button 
          onClick={() => setActiveTab("groups")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[11px] font-black uppercase tracking-widest rounded-md transition ${activeTab === "groups" ? "bg-white/10 text-white" : "hover:bg-white/5"}`}
        >
          <FaUsers size={12} /> Groups
        </button>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
        <div className="px-4 py-2 mt-4 mb-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
             {activeTab === "users" ? "Active Users" : "Active Channels"}
           </h3>
        </div>

        {isLoading ? (
          <div className="py-10"><LoadingSpinner size="sm" /></div>
        ) : activeTab === "users" ? (
          users.filter((u: any) => u.id !== user?.id).map((u: any) => (
            <button
              key={u.id}
              onClick={() => onSelectUser(u)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition text-left group
                ${selectedUserId === u.id ? "bg-[#1164A3] text-white" : "hover:bg-white/[0.05]"}
              `}
            >
              <div className="relative flex-shrink-0">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-md object-cover" />
                ) : (
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border border-white/10 bg-white/5 text-gray-400`}>
                    {u.username[0].toUpperCase()}
                  </div>
                )}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#19171D] bg-emerald-500 shadow-sm animate-pulse`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-[13px] font-semibold truncate ${selectedUserId === u.id ? "text-white" : "text-[#D1D2D3]"}`}>{u.username}</span>
              </div>
            </button>
          ))
        ) : (
          groups.map((g: any) => (
            <button
              key={g._id}
              onClick={() => onSelectUser({ ...g, isGroup: true, id: g._id })}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md transition text-left
                ${selectedUserId === g._id ? "bg-[#1164A3] text-white" : "hover:bg-white/[0.05]"}
              `}
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/5 text-gray-400 font-bold border border-white/10">#</div>
              <div className="flex-1 min-w-0">
                <span className={`text-[13px] font-semibold truncate ${selectedUserId === g._id ? "text-white" : "text-[#D1D2D3]"}`}>{g.name}</span>
              </div>
            </button>
          ))
        )}

        {/* Add Group Option */}
        {activeTab === "groups" && (
           <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition italic text-[13px]">
              <FaPlus size={12} /> Create Channel
           </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-black/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/10 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition"
        >
          <FaSignOutAlt size={14} /> Exit Workspace
        </button>
      </div>
    </div>
  );
};

export default Alluser;
