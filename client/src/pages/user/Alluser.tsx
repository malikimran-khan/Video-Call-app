import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchUsers, resetUsers } from "../../features/user/userSlice";
import { fetchMyGroups, resetGroups } from "../../features/group/groupSlice";
import { FaUser, FaEllipsisV, FaCog, FaSignOutAlt, FaUserCircle, FaUsers } from "react-icons/fa";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../../features/auth/authSlice";

interface AlluserProps {
  onSelectUser: (user: any) => void;
  selectedUserId: string | null;
}

const Alluser: React.FC<AlluserProps> = ({ onSelectUser, selectedUserId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading: usersLoading, isError: usersError, message: usersMessage } = useSelector(
    (state: RootState) => state.users
  );
  const { groups, isLoading: groupsLoading } = useSelector(
    (state: RootState) => state.groups
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMyGroups());
    return () => {
      dispatch(resetUsers());
      dispatch(resetGroups());
    };
  }, [dispatch]);

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const isLoading = usersLoading || groupsLoading;

  if (isLoading && users.length === 0 && groups.length === 0) return <LoadingSpinner size="md" label="Loading chats..." />;
  if (usersError) return <p className="text-center mt-10 text-red-500">{usersMessage}</p>;

  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col h-full z-10">
      {/* Current User Header */}
      <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/80">
        <div className="flex items-center gap-3">
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.username} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 cursor-pointer"
              onClick={() => navigate('/profile')}
            />
          ) : (
            <div 
              className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <FaUser size={18} className="text-gray-400" />
            </div>
          )}
          <span className="font-semibold text-gray-800 hidden sm:block">
            {currentUser?.username || "Chats"}
          </span>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
          >
            <FaEllipsisV size={18} />
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
              <button 
                onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <FaUserCircle size={16} className="text-gray-400" /> Profile
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); alert("Settings coming soon!"); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <FaCog size={16} className="text-gray-400" /> Settings
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition"
              >
                <FaSignOutAlt size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Groups Section */}
        {groups.length > 0 && (
          <div className="py-2">
            <h4 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Groups</h4>
            {groups.map((group: any) => (
              <div
                key={group._id}
                onClick={() => onSelectUser({ ...group, id: group._id, isGroup: true })}
                className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-b border-gray-50 ${
                  selectedUserId === group._id ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <FaUsers size={24} />
                  </div>
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{group.name}</h3>
                  <p className="text-gray-500 text-sm truncate">{group.members.length} members</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <h4 className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider mt-2">Direct Messages</h4>
        {users.length > 0 ? (
          users.map((user: any) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center p-4 cursor-pointer transition-colors duration-200 border-b border-gray-50 ${
                selectedUserId === user.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                     <FaUser size={20} className="text-gray-400" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.username}</h3>
                <p className="text-gray-500 text-sm truncate">{user.bio || "Available"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-8 text-sm">No other users found.</p>
        )}
      </div>
    </div>
  );
};

export default Alluser;
