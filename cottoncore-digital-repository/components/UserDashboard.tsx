
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Fingerprint, Activity, Zap, ShieldCheck, History, MousePointer2, LogIn } from 'lucide-react';

interface UserDashboardProps {
  loginCount: number;
  timeSpentSeconds: number;
  lastLogin: string | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ loginCount, timeSpentSeconds, lastLogin }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Cast motion to any to avoid property errors like 'whileHover'
  const m = motion as any;

  const activityLogs = useMemo(() => [
    { event: "Terminal Uplink", status: "STABLE", time: "Just Now" },
    { event: "Encryption Handshake", status: "VERIFIED", time: "2m ago" },
    { event: "Database Sync", status: "COMPLETE", time: "5m ago" },
    { event: "Session Initialized", status: "PRO-TIER", time: "Session Start" }
  ], []);

  return (
    <div className="min-h-screen p-8 md:p-16 lg:p-24 bg-slate-50 dark:bg-slate-950/40">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-blue-600/10 rounded border border-blue-500/20">
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 dark:text-blue-500 uppercase">Personal Usage Telemetry</span>
              </div>
              <div className="h-[1px] w-20 bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-slate-900 dark:text-white">
              Activity <br/> <span className="text-blue-600">Monitor</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Entry Count Card */}
            <m.div 
              whileHover={{ y: -5 }}
              className="hud-border glass-terminal p-10 rounded-[2.5rem] relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <LogIn className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-2xl">
                  <Fingerprint className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Entries</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black text-slate-900 dark:text-white">{loginCount}</h3>
                <span className="text-xs font-bold text-slate-400 uppercase">Sessions</span>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed">Cumulative system initializations recorded since deployment.</p>
            </m.div>

            {/* Time Spent Card */}
            <m.div 
              whileHover={{ y: -5 }}
              className="hud-border glass-terminal p-10 rounded-[2.5rem] relative overflow-hidden group shadow-xl border border-blue-500/10"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-2xl">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Contributed</span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white">{formatTime(timeSpentSeconds)}</h3>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed">Live tracking of your analytical immersion within the CottonCore ecosystem.</p>
            </m.div>

            {/* Last Access Card */}
            <m.div 
              whileHover={{ y: -5 }}
              className="hud-border glass-terminal p-10 rounded-[2.5rem] relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <History className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Verified Access</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'N/A'}
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {lastLogin ? new Date(lastLogin).toLocaleTimeString() : 'Awaiting authentication...'}
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed">Timestamp of the most recent encrypted session handshake.</p>
            </m.div>
          </div>

          {/* Activity Log Table */}
          <div className="hud-border glass-terminal p-10 rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-900 dark:bg-white rounded-xl">
                <Zap className={`w-5 h-5 ${'text-white dark:text-black'}`} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Recent Uplink History</h3>
            </div>
            
            <div className="space-y-4">
              {activityLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{log.event}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                    <span className="text-[9px] font-black px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded uppercase tracking-widest">{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
