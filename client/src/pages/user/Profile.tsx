import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { FaUser, FaEnvelope, FaCamera, FaArrowLeft, FaTrash, FaSave, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateProfile, deleteAccount, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user, isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <p className="mb-4">No user logged in.</p>
        <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">Go to Login</button>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size should be less than 10MB");
        return;
      }

      setAvatarPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    const updates: { username?: string; avatar?: string; bio?: string } = {};
    if (username !== user.username) updates.username = username;
    if (bio !== (user.bio || "")) updates.bio = bio;
    if (avatarBase64) updates.avatar = avatarBase64;

    if (Object.keys(updates).length === 0) {
      toast.info("No changes made.");
      return;
    }

    try {
      await dispatch(updateProfile(updates)).unwrap();
      toast.success("Profile updated successfully!");
      setAvatarBase64(null); // Reset pending avatar change
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you SURE you want to permanently delete your account? This action cannot be undone.")) {
      try {
        await dispatch(deleteAccount()).unwrap();
        toast.success("Account deleted successfully.");
        navigate('/login');
      } catch (err) {
        toast.error("Failed to delete account.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-4 flex items-center">
          <button 
            onClick={() => navigate('/chat-app')}
            className="text-white p-2 rounded-full hover:bg-white/20 transition mr-2"
          >
            <FaArrowLeft />
          </button>
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
        </div>

        <div className="p-8">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center mb-8 relative">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md transition group-hover:brightness-75"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md transition group-hover:brightness-75">
                  <FaUser size={50} className="text-gray-400" />
                </div>
              )}
              
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <FaCamera size={24} className="text-white" />
              </div>

              {/* Edit Badge */}
              <div className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full border-2 border-white shadow-sm">
                <FaCamera size={14} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">Tap to change avatar</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email (Read Only)</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed">
                <FaEnvelope className="text-gray-400" />
                <span className="flex-1 truncate">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Username</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition shadow-sm">
                <FaUser className="text-gray-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">About</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition shadow-sm">
                <FaInfoCircle className="text-gray-400" />
                <input 
                  type="text" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  placeholder="Hey there! I am using iVoice Chat."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 space-y-3">
             <button
              onClick={handleSave}
              disabled={isLoading || (username === user.username && bio === (user.bio || "") && !avatarBase64)}
              className="w-full flex justify-center items-center gap-2 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><FaSave size={16} /> Save Changes</>
              )}
            </button>
             
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-100 transition disabled:opacity-50"
            >
              <FaTrash size={14} /> Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
