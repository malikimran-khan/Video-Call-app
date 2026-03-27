import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  CheckCircle, 
  XCircle, 
  User as UserIcon, 
  Users,
  Loader2, 
  Mail, 
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Trash2,
  AlertTriangle,
  UserPlus,
  Plus,
  X,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isAdminVerified: boolean;
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"unverified" | "verified">("unverified");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (userId: string) => {
    try {
      setVerifyingId(userId);
      await api.put(`/admin/users/${userId}/verify`);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdminVerified: true } : u
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to verify user");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreatingUser(true);
      const res = await api.post("/admin/users", newUser);
      setUsers([res.data.user, ...users]);
      setShowCreateModal(false);
      setNewUser({ username: "", email: "", password: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      setDeletingId(userId);
      await api.delete(`/admin/users/${userId}`);
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      setShowDeleteConfirm(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === "unverified" ? !u.isAdminVerified : u.isAdminVerified)
  );

  const unverifiedCount = users.filter(u => !u.isAdminVerified).length;
  const verifiedCount = users.filter(u => u.isAdminVerified).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-dark-muted mt-1">Manage and verify users in your platform.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">Create User</span>
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-border text-white border border-dark-border rounded-xl transition-all group active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-primary-500 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh Data</span>
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 glass border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 backdrop-blur-xl"
        >
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Users} label="Total Users" value={users.length} color="primary" />
        <StatsCard icon={ShieldAlert} label="Pending" value={unverifiedCount} color="yellow" />
        <StatsCard icon={ShieldCheck} label="Verified" value={verifiedCount} color="green" />
        <StatsCard icon={Mail} label="New Joins" value={users.filter(u => {
          const joined = new Date(u.createdAt);
          const today = new Date();
          return joined.toDateString() === today.toDateString();
        }).length} color="purple" />
      </div>

      <div className="glass rounded-2xl overflow-hidden border-dark-border bg-dark-card/30">
        {/* Controls */}
        <div className="p-4 border-b border-dark-border flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Tabs */}
          <div className="flex p-1 bg-dark-bg/50 rounded-xl border border-dark-border">
            <TabButton 
              active={activeTab === "unverified"} 
              onClick={() => setActiveTab("unverified")}
              count={unverifiedCount}
              label="Pending"
            />
            <TabButton 
              active={activeTab === "verified"} 
              onClick={() => setActiveTab("verified")}
              count={verifiedCount}
              label="Verified"
            />
          </div>

          <div className="flex-1 lg:flex justify-end gap-3">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-dark-bg rounded-xl border border-dark-border group transition-all">
              <Filter className="w-4 h-4 text-dark-muted group-hover:text-primary-400" />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-80 gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary-500/10 border-b-primary-500 rounded-full animate-spin-reverse"></div>
                </div>
              </div>
              <p className="text-dark-muted text-sm font-medium animate-pulse">Loading secure user data...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-24 bg-dark-card/10">
              <div className="w-16 h-16 bg-dark-bg border border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-dark-muted" />
              </div>
              <h3 className="text-lg font-medium text-white">No users found</h3>
              <p className="text-dark-muted mt-1 max-w-xs mx-auto">
                {searchTerm 
                  ? `No results for "${searchTerm}" in ${activeTab} users.` 
                  : activeTab === "unverified" 
                    ? "All users have been verified! Good job." 
                    : "No verified users yet."}
              </p>
            </div>
          ) : (
            <motion.table 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="min-w-full divide-y divide-dark-border"
            >
              <thead className="bg-dark-bg/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-dark-muted uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-dark-muted uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-dark-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-dark-muted uppercase tracking-wider">Account Created</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-dark-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id} 
                      variants={itemVariants}
                      layout
                      className="group hover:bg-primary-600/5 transition-colors duration-300"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative flex-shrink-0 h-11 w-11 group/avatar">
                            <div className="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-0 group-hover/avatar:opacity-20 transition-opacity"></div>
                            {user.avatar ? (
                              <img className="h-11 w-11 rounded-xl object-cover border border-dark-border group-hover/avatar:border-primary-500/50 transition-colors" src={user.avatar} alt="" />
                            ) : (
                              <div className="h-11 w-11 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center text-primary-400 group-hover/avatar:border-primary-500/50 transition-colors">
                                <UserIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{user.username}</div>
                            <div className="text-xs text-dark-muted truncate max-w-[200px] mt-0.5">{user.bio || 'No bio provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-white/90">
                            <Mail className="w-3.5 h-3.5 mr-2 text-primary-500" />
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <Badge 
                            variant={user.isVerified ? "green" : "yellow"} 
                            label={user.isVerified ? "Email Confirmed" : "Email Pending"} 
                          />
                          <Badge 
                            variant={user.isAdminVerified ? "primary" : "red"} 
                            label={user.isAdminVerified ? "Admin Verified" : "Admin Pending"} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center text-sm text-dark-muted">
                          <Calendar className="w-3.5 h-3.5 mr-2" />
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === "unverified" && (
                            <button
                              onClick={() => handleVerify(user.id)}
                              disabled={verifyingId === user.id}
                              className={`
                                inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all
                                ${verifyingId === user.id 
                                  ? 'bg-dark-bg border-dark-border text-dark-muted cursor-not-allowed' 
                                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20 active:scale-95'}
                              `}
                            >
                              {verifyingId === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                  Verify
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 text-dark-muted hover:text-red-400"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-dark-bg rounded-lg transition-colors border border-transparent hover:border-dark-border text-dark-muted hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass p-6 rounded-2xl border-red-500/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 text-red-400 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Account?</h3>
              </div>
              <p className="text-dark-muted mb-6 leading-relaxed">
                This action is <span className="text-red-400 font-bold uppercase">permanent</span>.
                All messages, call history, and media files associated with this user will be deleted from the database and Cloudinary.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-dark-bg hover:bg-dark-border text-white border border-dark-border rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {deletingId === showDeleteConfirm ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete Permanently"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass overflow-hidden rounded-3xl border-primary-500/20 shadow-2xl"
            >
              <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-card/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/10 rounded-lg border border-primary-500/20 text-primary-500">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Create New User</h2>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-dark-bg rounded-lg text-dark-muted hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-bold text-dark-muted mb-1.5 block">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input 
                      type="text" 
                      required
                      value={newUser.username}
                      onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="johndoe"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-dark-muted mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input 
                      type="email" 
                      required
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-dark-muted mb-1.5 block">Initial Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input 
                      type="password" 
                      required
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl mt-2">
                  <p className="text-[10px] text-primary-400 font-medium leading-relaxed">
                    Note: This user will be <span className="font-bold">pre-approved</span> but will be asked to verify their email via OTP during their first login attempt.
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-dark-border text-sm font-bold hover:bg-dark-card transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={creatingUser}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                  >
                    {creatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    primary: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
    green: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    yellow: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    red: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div className={`glass p-5 rounded-2xl border-l-4 overflow-hidden relative group ${colors[color]}`}>
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-16 h-16" />
      </div>
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-dark-bg/60 border border-current transition-transform group-hover:rotate-6`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, count, label }: { active: boolean, onClick: () => void, count: number, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2
        ${active 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
          : 'text-dark-muted hover:text-white hover:bg-dark-bg/80'}
      `}
    >
      {label}
      <span className={`
        px-2 py-0.5 rounded-full text-[10px] font-black
        ${active ? 'bg-white/20 text-white' : 'bg-dark-border text-dark-muted'}
      `}>
        {count}
      </span>
    </button>
  );
}

function Badge({ variant, label }: { variant: string, label: string }) {
  const variants: Record<string, string> = {
    primary: "bg-primary-500/10 text-primary-400 border-primary-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-tight flex items-center justify-center w-max ${variants[variant] || variants.primary}`}>
      {label}
    </span>
  );
}
