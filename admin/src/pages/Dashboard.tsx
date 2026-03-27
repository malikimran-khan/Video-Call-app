import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Users, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  users: { total: number; verified: number; unverified: number };
  groups: { total: number };
  messages: {
    total: number;
    text: number;
    image: number;
    video: number;
    voice: number;
    document: number;
  };
  calls: {
    total: number;
    completed: number;
    missed: number;
    declined: number;
  };
  recentUsers: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-dark-muted font-medium">Gathering platform insights...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 glass rounded-2xl border-red-500/20 text-center">
        <p className="text-red-400 font-medium">{error || "Something went wrong"}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-dark-bg border border-dark-border rounded-xl text-sm hover:bg-dark-card transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
          <p className="text-dark-muted mt-1">Real-time snapshots of your communication ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-dark-card/50 border border-dark-border rounded-xl">
          <div className="px-3 py-1.5 bg-primary-600 rounded-lg text-xs font-bold shadow-lg shadow-primary-600/20">Live View</div>
          <div className="px-3 py-1.5 text-xs font-bold text-dark-muted">Updates every minute</div>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard 
          icon={Users} 
          label="Total Users" 
          value={stats.users.total} 
          subValue={`${stats.users.verified} Verified`}
          color="blue"
          link="/users"
        />
        <OverviewCard 
          icon={ShieldCheck} 
          label="Total Groups" 
          value={stats.groups.total} 
          subValue="Active Channels"
          color="emerald"
          link="/groups"
        />
        <OverviewCard 
          icon={MessageSquare} 
          label="Messages" 
          value={stats.messages.total} 
          subValue={`${stats.messages.image + stats.messages.video} Media Files`}
          color="purple"
        />
        <OverviewCard 
          icon={Phone} 
          label="Total Calls" 
          value={stats.calls.total} 
          subValue={`${stats.calls.completed} Successful`}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              Recent Registrations
            </h2>
            <Link to="/users" className="text-sm font-bold text-primary-500 hover:text-primary-400 flex items-center gap-1 group transition-all">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="glass rounded-2xl overflow-hidden divide-y divide-dark-border">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-primary-600/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-bg border border-dark-border overflow-hidden p-0.5">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                      className="w-full h-full object-cover rounded-[10px]" 
                      alt="" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary-400 transition-colors">{user.username}</h4>
                    <p className="text-xs text-dark-muted">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase ${user.isAdminVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {user.isAdminVerified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">Joined</p>
                    <p className="text-xs font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Quick Insights
          </h2>
          <div className="glass p-6 rounded-2xl space-y-6">
            <div>
              <p className="text-sm font-bold text-dark-muted mb-4 uppercase tracking-wider">Message Distribution</p>
              <div className="space-y-3">
                <ProgressItem label="Text" value={stats.messages.text} total={stats.messages.total} color="bg-blue-500" />
                <ProgressItem label="Images" value={stats.messages.image} total={stats.messages.total} color="bg-purple-500" />
                <ProgressItem label="Videos" value={stats.messages.video} total={stats.messages.total} color="bg-rose-500" />
                <ProgressItem label="Documents" value={stats.messages.document} total={stats.messages.total} color="bg-amber-500" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-dark-border">
              <p className="text-sm font-bold text-dark-muted mb-4 uppercase tracking-wider">Call Completion Rate</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold">
                  {stats.calls.total > 0 ? Math.round((stats.calls.completed / stats.calls.total) * 100) : 0}%
                </span>
                <span className="text-emerald-500 text-xs font-bold mb-1.5 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Healthy
                </span>
              </div>
              <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" 
                  style={{ width: `${stats.calls.total > 0 ? (stats.calls.completed / stats.calls.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value, subValue, color, link }: { icon: any, label: string, value: number, subValue: string, color: string, link?: string }) {
  const CardContent = (
    <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <p className="text-sm font-bold text-dark-muted uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-3xl font-black">{value.toLocaleString()}</h3>
          <span className="text-[10px] font-bold text-dark-muted uppercase">{subValue}</span>
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{CardContent}</Link> : CardContent;
}

function ProgressItem({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span className="text-dark-muted">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
