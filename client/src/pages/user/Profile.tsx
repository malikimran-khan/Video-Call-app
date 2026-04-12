import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { FaUser, FaEnvelope, FaCamera, FaArrowLeft, FaTrash, FaSave, FaInfoCircle, FaUserCog } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#F8F8F8] text-gray-400">
        <p className="mb-4">No session found.</p>
        <button onClick={() => navigate('/login')} className="text-[#1164A3] hover:underline font-bold">Go to Login</button>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
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
      setAvatarBase64(null);
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
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center py-12 px-4 font-sans text-[#1D1C1D]">
       <div className="w-full max-w-2xl bg-white border border-[#E2E2E2] rounded-2xl shadow-sm overflow-hidden mt-10">
        
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-[#E2E2E2] flex items-center justify-between">
           <div className="flex items-center gap-5">
              <Link to="/chat-app">
                 <button className="text-gray-400 hover:text-[#1D1C1D] transition p-2 hover:bg-gray-50 rounded-lg">
                    <FaArrowLeft size={18} />
                 </button>
              </Link>
              <div>
                 <h2 className="text-2xl font-black tracking-tight">Profile Settings</h2>
                 <p className="text-xs font-medium text-gray-500">Manage your identity and public information</p>
              </div>
           </div>
           <div className="w-10 h-10 bg-blue-50 text-[#1164A3] rounded-lg flex items-center justify-center border border-blue-100">
              <FaUserCog size={18} />
           </div>
        </div>

        <div className="p-10 md:p-12">
          {/* Avatar Edit */}
          <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-md transition group-hover:opacity-80"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gray-50 flex items-center justify-center border-2 border-dashed border-[#E2E2E2] text-gray-300 transition group-hover:bg-gray-100">
                  <FaUser size={40} />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                <FaCamera size={20} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold mb-1">Profile Photo</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">Clear photos help your colleagues recognize you across the workspace.</p>
                <div className="flex gap-3 justify-center md:justify-start">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#1164A3] text-white rounded-lg text-xs font-bold hover:bg-[#0b4d7e] transition shadow-sm"
                    >
                        Change Photo
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-[#E2E2E2] text-[#1D1C1D] rounded-lg text-xs font-bold hover:bg-gray-50 transition">
                        Remove
                    </button>
                </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#1D1C1D]">Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-[#E2E2E2] rounded-xl text-gray-400 cursor-not-allowed">
                        <FaEnvelope size={14} />
                        <span className="text-sm font-medium truncate">{user.email}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-[#1D1C1D]">Username</label>
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-white border border-[#E2E2E2] rounded-xl focus-within:border-[#1164A3] transition-all shadow-sm">
                        <FaUser size={14} className="text-gray-400" />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex-1 outline-none text-[#1D1C1D] placeholder-gray-300 text-sm font-semibold"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-[#1D1C1D]">Status / Bio</label>
                <div className="flex items-start gap-3 px-4 py-3.5 bg-white border border-[#E2E2E2] rounded-xl focus-within:border-[#1164A3] transition-all shadow-sm">
                    <FaInfoCircle size={14} className="text-gray-400 mt-1" />
                    <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="flex-1 outline-none text-[#1D1C1D] placeholder-gray-300 text-sm font-semibold min-h-[100px] resize-none"
                        placeholder="What's your current status?"
                    />
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-[#E2E2E2]">
             <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex items-center gap-3 text-xs font-bold text-red-600 hover:text-red-700 transition"
             >
                <FaTrash size={12} /> Delete Account permanently
             </button>

             <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                    onClick={() => navigate('/chat-app')}
                    className="flex-1 md:flex-none px-8 py-3.5 bg-white border border-[#E2E2E2] text-[#1D1C1D] rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isLoading || (username === user.username && bio === (user.bio || "") && !avatarBase64)}
                    className="flex-1 md:flex-none px-10 py-3.5 bg-[#1164A3] text-white rounded-xl text-sm font-extrabold hover:bg-[#0b4d7e] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                    <><FaSave size={14}/> Save Changes</>
                    )}
                </button>
             </div>
          </div>

        </div>
       </div>

       <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 opacity-60">
          <span>iVoice Workspace</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>Secure Identity Layer</span>
       </div>
    </div>
  );
};

export default Profile;
