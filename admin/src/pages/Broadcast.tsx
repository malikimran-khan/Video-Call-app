import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Send, 
  Mail, 
  Video, 
  MessageSquare, 
  Link as LinkIcon, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Info,
  Users,
  Search,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BroadcastType = "zoom" | "google-meet" | "site-call" | "message";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export default function Broadcast() {
  const [type, setType] = useState<BroadcastType>("message");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Targeted Broadcast State
  const [targeting, setTargeting] = useState<"all" | "selective">("all");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [fetchingUsers, setFetchingUsers] = useState(false);

  useEffect(() => {
    if (targeting === "selective") {
      fetchUsers();
    }
  }, [targeting]);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const res = await api.get("/admin/users");
      // Filter only verified users if the API doesn't already
      const verified = res.data.filter((u: any) => u.isAdminVerified);
      setAvailableUsers(verified);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const filteredUsers = availableUsers.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!subject || !message) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    if (type !== "message" && !link) {
      setStatus({ type: "error", text: "Please provide a meeting link." });
      return;
    }

    if (targeting === "selective" && selectedUserIds.length === 0) {
      setStatus({ type: "error", text: "Please select at least one user." });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      
      const res = await api.post("/admin/broadcast", {
        type,
        subject,
        message,
        link: type === "message" ? undefined : link,
        userIds: targeting === "all" ? undefined : selectedUserIds
      });

      setStatus({ 
        type: "success", 
        text: res.data.message || "Broadcast sent successfully!" 
      });
      
      // Reset form on success
      setSubject("");
      setMessage("");
      setLink("");
      if (targeting === "selective") {
        setSelectedUserIds([]);
        setTargeting("all");
      }
    } catch (err: any) {
      console.error(err);
      setStatus({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to send broadcast. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch(type) {
      case "zoom": return <Video className="w-5 h-5 text-blue-400" />;
      case "google-meet": return <Video className="w-5 h-5 text-emerald-400" />;
      case "site-call": return <LinkIcon className="w-5 h-5 text-primary-400" />;
      default: return <MessageSquare className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Broadcast Center</h1>
          <p className="text-dark-muted mt-1">Communicate with your users globally or individually.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Configuration and Targeting */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Audience Selector */}
          <div className="glass p-6 rounded-2xl border-primary-500/10">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary-500" />
              Target Audience
            </h3>
            <div className="flex bg-dark-bg p-1 rounded-xl border border-dark-border mb-4">
              <button 
                onClick={() => setTargeting("all")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${targeting === "all" ? "bg-primary-600 text-white shadow-lg" : "text-dark-muted hover:text-white"}`}
              >
                All Users
              </button>
              <button 
                onClick={() => setTargeting("selective")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${targeting === "selective" ? "bg-primary-600 text-white shadow-lg" : "text-dark-muted hover:text-white"}`}
              >
                Selected
              </button>
            </div>

            <AnimatePresence mode="wait">
              {targeting === "selective" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input 
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                    />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {fetchingUsers ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <div 
                          key={user.id} 
                          onClick={() => toggleUser(user.id)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${selectedUserIds.includes(user.id) ? "bg-primary-500/10 border-primary-500/30" : "bg-dark-bg/50 border-transparent hover:border-dark-border"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border overflow-hidden">
                              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{user.username}</p>
                              <p className="text-[10px] text-dark-muted truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedUserIds.includes(user.id) ? "bg-primary-500 border-primary-500" : "border-dark-border group-hover:border-dark-muted"}`}>
                            {selectedUserIds.includes(user.id) && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-dark-muted">No users found</div>
                    )}
                  </div>
                  
                  {selectedUserIds.length > 0 && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary-500 tracking-wider">{selectedUserIds.length} Selected</span>
                      <button 
                        onClick={() => setSelectedUserIds([])}
                        className="text-[10px] font-bold text-dark-muted hover:text-rose-400 flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Clear All
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {targeting === "all" && (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-sm font-bold text-white">Full Audience</p>
                <p className="text-xs text-dark-muted">Message will be delivered to every verified member of the platform.</p>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-sm">
              <Info className="w-4 h-4 text-primary-500" />
              Quick Info
            </h3>
            <p className="text-xs text-dark-muted leading-relaxed">
              Targeted broadcasts are perfect for 1-on-1 interviews, private consultations, or specific group announcements.
            </p>
          </div>
        </div>

        {/* Right Side: Message Content */}
        <div className="lg:col-span-8">
          <motion.form 
            onSubmit={handleSubmit}
            className="glass p-10 rounded-3xl space-y-8 relative overflow-hidden h-full"
            layout
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <Mail className="w-64 h-64" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] block">Broadcast Type</label>
                <div className="flex flex-wrap gap-2">
                  <TypeButton active={type === "message"} onClick={() => setType("message")} label="Announcement" />
                  <TypeButton active={type === "zoom"} onClick={() => setType("zoom")} label="Zoom Link" />
                  <TypeButton active={type === "google-meet"} onClick={() => setType("google-meet")} label="Google Meet" />
                  <TypeButton active={type === "site-call"} onClick={() => setType("site-call")} label="Direct Call" />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] block">Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="The purpose of this reach-out..."
                  className="w-full bg-dark-bg border border-dark-border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-dark-muted/40 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-dark-muted uppercase tracking-[0.2em] block">Content Template</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={8}
                placeholder="Type your message here. For calls, describe the agenda..."
                className="w-full bg-dark-bg border border-dark-border rounded-2xl px-5 py-5 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-dark-muted/40 resize-none font-medium leading-relaxed"
                required
              />
            </div>

            {type !== "message" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 p-6 bg-primary-500/5 rounded-2xl border border-primary-500/10"
              >
                <label className="text-xs font-black text-primary-500 uppercase tracking-[0.2em] block">Actionable Link / URL</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-transform hover:scale-110">
                    {getIcon()}
                  </div>
                  <input 
                    type="url" 
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="https://yourapp.link/room/123"
                    className="w-full bg-dark-bg border border-dark-border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all placeholder:text-dark-muted/40 font-mono text-sm"
                    required
                  />
                </div>
              </motion.div>
            )}

            <div className="pt-6">
              <AnimatePresence mode="wait">
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mb-8 p-5 rounded-2xl flex items-center gap-4 ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                      {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{status.type === "success" ? "Success!" : "Action Required"}</p>
                      <p className="text-xs opacity-80">{status.text}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 group ${loading ? "bg-dark-border cursor-not-allowed text-dark-muted" : "bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/30"}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    {targeting === "all" ? "Broadcast to Platform" : "Send to Selected Users"}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

function TypeButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${active ? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/20" : "bg-dark-bg border-dark-border text-dark-muted hover:text-white hover:border-dark-muted"}`}
    >
      {label}
    </button>
  );
}
