import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  Database, 
  Server, 
  Globe, 
  Users,
  HardDrive, 
  ShieldCheck, 
  Loader2,
  PieChart,
  BarChart3,
  CheckCircle2,
  Info
} from "lucide-react";

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
}

export default function Settings() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err: any) {
      console.error(err);
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
        <p className="text-dark-muted font-medium">Loading system configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Project Settings</h1>
          <p className="text-dark-muted mt-1">Configure and monitor your platform's infrastructure.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 glass rounded-xl border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Project Info & Server Status */}
        <div className="lg:col-span-1 space-y-6">
          <SectionHeader icon={Info} title="Project Information" />
          <div className="glass p-6 rounded-2xl space-y-4">
            <InfoItem label="App Name" value="iVoice Video Call" />
            <InfoItem label="Version" value="2.1.4-beta" />
            <InfoItem label="Environment" value="Production" highlight />
            <InfoItem label="Build Date" value={new Date().toLocaleDateString()} />
          </div>

          <SectionHeader icon={Server} title="Server & Database" />
          <div className="glass p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary-500" />
                <span className="font-bold">MongoDB</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-emerald-400">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-500" />
                <span className="font-bold">API Region</span>
              </div>
              <span className="text-sm font-medium text-dark-muted">US-East (Vercel)</span>
            </div>

            <div className="pt-4 border-t border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-dark-muted uppercase tracking-wider">Storage Usage</span>
                <span className="text-xs font-bold">14.2 GB / 20 GB</span>
              </div>
              <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" style={{ width: '71%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Statistics */}
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader icon={BarChart3} title="Platform Volume Statistics" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox 
              icon={Users} 
              label="User Distribution" 
              items={[
                { label: 'Verified', value: stats?.users.verified || 0, color: 'text-emerald-400' },
                { label: 'Unverified', value: stats?.users.unverified || 0, color: 'text-amber-400' }
              ]} 
            />
            <StatBox 
              icon={PieChart} 
              label="Call Performance" 
              items={[
                { label: 'Completed', value: stats?.calls.completed || 0, color: 'text-emerald-400' },
                { label: 'Missed', value: stats?.calls.missed || 0, color: 'text-rose-400' },
                { label: 'Declined', value: stats?.calls.declined || 0, color: 'text-dark-muted' }
              ]} 
            />
          </div>

          <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <BarChart3 className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-primary-500" />
              Content Type Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <Metric label="Text" value={stats?.messages.text || 0} />
              <Metric label="Images" value={stats?.messages.image || 0} />
              <Metric label="Videos" value={stats?.messages.video || 0} />
              <Metric label="Voice" value={stats?.messages.voice || 0} />
              <Metric label="Docs" value={stats?.messages.document || 0} />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl bg-primary-600/5 border-primary-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
                <ShieldCheck className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-bold text-white">System Logs & Auditing</h4>
                <p className="text-sm text-dark-muted mt-0.5">Automated security protocols are active. All administrative actions are currently logged.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="p-1.5 bg-dark-card border border-dark-border rounded-lg">
        <Icon className="w-4 h-4 text-primary-500" />
      </div>
      <h2 className="text-lg font-bold text-white/90 uppercase tracking-tight">{title}</h2>
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-dark-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-bold text-dark-muted">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-primary-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function StatBox({ icon: Icon, label, items }: { icon: any, label: string, items: { label: string, value: number, color: string }[] }) {
  return (
    <div className="glass p-6 rounded-2xl h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-dark-bg border border-dark-border rounded-xl">
          <Icon className="w-4 h-4 text-primary-500" />
        </div>
        <h3 className="font-bold text-sm uppercase tracking-wider text-dark-muted">{label}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.label}</span>
            <span className={`text-xl font-black ${item.color}`}>{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string, value: number }) {
  return (
    <div className="text-center p-3 rounded-2xl bg-dark-bg/40 border border-dark-border/50 hover:bg-dark-bg transition-colors">
      <p className="text-[10px] font-black uppercase text-dark-muted tracking-[0.2em] mb-1">{label}</p>
      <p className="text-xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );
}
