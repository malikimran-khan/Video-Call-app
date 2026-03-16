import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Users, 
  Plus, 
  Loader2, 
  CheckCircle, 
  X,
  UserPlus,
  ShieldCheck,
  Calendar,
  MoreVertical,
  Info,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdminVerified: boolean;
}

interface Group {
  _id: string;
  name: string;
  description?: string;
  members: User[];
  admin: User;
  createdAt: string;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Group Form
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsRes, usersRes] = await Promise.all([
        api.get("/groups"),
        api.get("/admin/users")
      ]);
      setGroups(groupsRes.data);
      // Only verified users can be added
      setUsers(usersRes.data.filter((u: any) => u.isAdminVerified));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    try {
      setCreating(true);
      const res = await api.post("/groups", {
        name: newGroupName,
        description: newGroupDesc,
        members: selectedMembers
      });
      setGroups([...groups, res.data]);
      setIsModalOpen(false);
      setNewGroupName("");
      setNewGroupDesc("");
      setSelectedMembers([]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      setDeletingId(groupId);
      await api.delete(`/groups/${groupId}`);
      setGroups(groups.filter(g => g._id !== groupId));
      setShowDeleteConfirm(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete group");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Groups</h1>
          <p className="text-dark-muted mt-1">Create and manage access-controlled user groups.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create New Group</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-24 glass rounded-2xl border-dashed">
          <Users className="w-12 h-12 text-dark-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium">No groups created yet</h3>
          <p className="text-dark-muted mt-1">Start by creating your first group and adding members.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-6 rounded-2xl flex flex-col gap-4 group/card hover:border-primary-500/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center border border-primary-500/20">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setShowDeleteConfirm(group._id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-dark-muted hover:text-red-400 transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-dark-bg rounded-lg text-dark-muted hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{group.name}</h3>
                <p className="text-sm text-dark-muted mt-1 line-clamp-2">{group.description || 'No description provided'}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-dark-border">
                <div className="flex items-center justify-between text-xs text-dark-muted">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>{group.members.length} Verified Members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex -space-x-2 mt-3 overflow-hidden">
                  {group.members.slice(0, 5).map((member, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-card bg-dark-bg overflow-hidden ring-1 ring-dark-border">
                       <img src={member.avatar || `https://ui-avatars.com/api/?name=${member.username}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-dark-card bg-dark-bg flex items-center justify-center text-[10px] font-bold text-primary-400">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] glass rounded-3xl z-50 overflow-hidden shadow-2xl border-primary-500/20"
            >
              <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-card/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/10 rounded-lg border border-primary-500/20">
                    <UserPlus className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold">Create New Group</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-dark-bg rounded-lg text-dark-muted hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateGroup} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-dark-muted mb-1.5 block">Group Name</label>
                    <input 
                      type="text" 
                      required
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      placeholder="e.g. Executive Team"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-dark-muted mb-1.5 block">Description (Optional)</label>
                    <textarea 
                      value={newGroupDesc}
                      onChange={e => setNewGroupDesc(e.target.value)}
                      placeholder="Brief description of the group's purpose..."
                      rows={3}
                      className="w-full bg-dark-bg border border-dark-border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-dark-muted">Select Verified Members</label>
                    <span className="text-[10px] font-black uppercase text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                      {selectedMembers.length} Selected
                    </span>
                  </div>
                  
                  <div className="bg-dark-bg/50 border border-dark-border rounded-2xl overflow-hidden max-h-64 overflow-y-auto scrollbar-thin">
                    {users.length === 0 ? (
                      <div className="p-8 text-center">
                        <Info className="w-8 h-8 text-dark-muted mx-auto mb-2" />
                        <p className="text-sm text-dark-muted">No verified users available to add.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-dark-border">
                        {users.map(user => (
                          <div 
                            key={user.id} 
                            onClick={() => toggleMember(user.id)}
                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-primary-600/5 transition-colors group ${selectedMembers.includes(user.id) ? 'bg-primary-600/10' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border overflow-hidden">
                                <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold group-hover:text-primary-400 transition-colors">{user.username}</p>
                                <p className="text-xs text-dark-muted">{user.email}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedMembers.includes(user.id) ? 'bg-primary-600 border-primary-600 shadow-sm' : 'border-dark-border bg-dark-bg'}`}>
                               {selectedMembers.includes(user.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-dark-border text-sm font-bold hover:bg-dark-card transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={creating || !newGroupName}
                    className="flex-2 py-3 px-4 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:scale-100 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Create Group
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Group Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(null)}
              className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm shadow-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass p-6 rounded-3xl border-red-500/20 shadow-2xl"
            >
              <div className="flex items-center gap-4 text-red-400 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Group?</h3>
              </div>
              <p className="text-dark-muted mb-6 leading-relaxed text-sm">
                This action is <span className="text-red-400 font-bold uppercase">permanent</span>.
                All group chat history and media will be purged from the database and Cloudinary.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 bg-dark-bg hover:bg-dark-border text-white border border-dark-border rounded-xl font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteGroup(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {deletingId === showDeleteConfirm ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete Group"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
