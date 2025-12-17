import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FaUser, FaEnvelope } from "react-icons/fa";

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No user logged in.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="flex flex-col items-center p-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-28 h-28 rounded-full object-cover mb-4"
          />
        ) : (
          <FaUser size={80} className="text-gray-400 mb-4" />
        )}

        <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <FaEnvelope /> {user.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
