import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchUsers, resetUsers } from "../../features/user/userSlice";
import { FaUser } from "react-icons/fa";

interface AlluserProps {
  onSelectUser: (user: any) => void;
  selectedUserId: string | null;
}

const Alluser: React.FC<AlluserProps> = ({ onSelectUser, selectedUserId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(resetUsers());
    };
  }, [dispatch]);

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading users...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">{message}</p>;

  return (
    <div className="w-full bg-white border-r border-gray-200 flex flex-col h-full z-10">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-lg text-gray-800">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                <p className="text-gray-500 text-sm truncate">{user.email}</p>
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
