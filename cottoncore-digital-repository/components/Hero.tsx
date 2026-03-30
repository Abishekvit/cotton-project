
import React from 'react';
import { motion } from 'framer-motion';
import { Database, LineChart, FlaskConical, ChevronRight, Zap, Activity, ShieldCheck, Globe } from 'lucide-react';

interface HeroProps {
  tier: 'Academic' | 'Pro';
  onScrollTo?: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ tier, onScrollTo }) => {
  const isPro = tier === 'Pro';
  // Cast motion to any to bypass strict property checking for shorthand motion components
  const m = motion as any;

  return (
    <section id="hero" className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/5 via-transparent to-transparent dark:from-blue-600/10 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-blue-500/10 via-transparent to-transparent blur-[120px] pointer-events-none opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 min-w-0">
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex bg-blue-600/10 dark:bg-blue-600/20 px-3 py-1 rounded-full border border-blue-500/20">
               <span className="text-[9px] font-black tracking-[0.4em] text-blue-600 dark:text-blue-400 uppercase">HVI Structural Analysis v4.2</span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/30 to-transparent"></div>
          </m.div>

          <m.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12 uppercase text-slate-900 dark:text-white break-words"
          >
            Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-600 dark:to-indigo-600">
              Fibers
            </span>
          </m.h1>

          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl max-w-2xl font-medium leading-relaxed mb-16"
          >
            The world's most advanced private repository for cotton analysis. 
            Transform laboratory raw data into actionable industrial intelligence with 
            <span className="text-blue-600 dark:text-blue-400 font-bold"> molecular-level precision</span>.
          </m.p>

          <div className="flex flex-wrap gap-4 md:gap-8 items-center">
            <button 
              onClick={() => onScrollTo?.('repository')}
              className="group relative bg-slate-900 dark:bg-white text-white dark:text-black px-8 md:px-12 py-5 rounded-2xl font-black text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl uppercase overflow-hidden"
            >
              INITIALIZE REPO
              <Database className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <button 
              onClick={() => onScrollTo?.('analytics')}
              className="glass-terminal text-slate-900 dark:text-white px-8 md:px-12 py-5 rounded-2xl font-black text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-4 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all uppercase"
            >
              SCI ANALYTICS
              <LineChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </button>
          </div>

          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 flex flex-wrap items-center gap-8 md:gap-12 text-slate-400 dark:text-slate-600"
          >
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Global Nodes</span>
                <span className="text-sm font-mono font-bold text-slate-500">4,281</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Verify Protocol</span>
                <span className="text-sm font-mono font-bold text-slate-500">HVI-2025.A</span>
             </div>
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Data Latency</span>
                <span className="text-sm font-mono font-bold text-blue-500">22ms</span>
             </div>
          </m.div>
        </div>

        <div className="lg:col-span-5 hidden lg:block min-w-0">
          <div className="hud-border glass-terminal p-10 rounded-[3rem] space-y-12 relative overflow-hidden shadow-2xl border border-blue-500/10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full animate-pulse"></div>
            
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Telemetry</span>
               </div>
               <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Spinning Potentional (Avg)</span>
                  <span className="text-2xl font-mono font-bold text-blue-500">142.8</span>
               </div>
               <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <m.div 
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                  ></m.div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-200 dark:border-white/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black text-slate-400 uppercase">Trust Level</span>
                </div>
                <div className="text-xl font-bold font-mono">MIL-SPEC</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Globe className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-black text-slate-400 uppercase">Sync Status</span>
                </div>
                <div className="text-xl font-bold font-mono">ENCRYPTED</div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400">
                <FlaskConical className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Lab-Ingestion Ready</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Session: 0xFF2A1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
