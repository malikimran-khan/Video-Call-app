import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import type { AppDispatch, RootState } from "../../app/store";
import { logout, reset } from "../../features/auth/authSlice";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        No user logged in.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm flex flex-col items-center">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        ) : (
          <FaUser size={80} className="text-gray-400 mb-4" />
        )}

        {/* User Info */}
        <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
        <p className="text-gray-500">{user.email}</p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
