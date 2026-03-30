
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, LabelList, Cell, AreaChart, Area
} from 'recharts';
import { METRIC_CONFIGS } from '../constants';
import { CottonReport } from '../types';
import { TrendingUp, Target, Zap, ScatterChart as ScatterIcon, Activity, Grid3X3, BarChart3, Scale, ChevronRight, Info, AlertCircle, CheckCircle2, Globe } from 'lucide-react';

interface AnalyticsSectionProps {
  tier: string;
  reports: CottonReport[];
  onUpgradeTrigger: () => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ tier, reports, onUpgradeTrigger }) => {
  const isPro = tier === 'Pro';
  const [activeTab, setActiveTab] = useState<'correlation' | 'consistency' | 'radar'>('correlation');
  
  const scatterData = (reports || []).flatMap(r => 
    r.bales.map(b => ({
      x: b.metrics.mic,
      y: b.metrics.str,
      z: b.metrics.sci,
      name: b.bale_id,
      batch: r.cotton_yarn_count
    }))
  );

  const consistencyData = (reports[0]?.bales || []).map((b, i) => ({
    index: i + 1,
    sci: b.metrics.sci,
    id: b.bale_id,
    str: b.metrics.str
  }));

  const radarData = reports[0] ? [
    { subject: 'Strength', Batch: reports[0].statistics.average.str, Standard: 31 },
    { subject: 'Uniformity', Batch: reports[0].statistics.average.ur, Standard: 82 },
    { subject: 'SCI', Batch: reports[0].statistics.average.sci, Standard: 140 },
    { subject: 'Micronaire', Batch: (5 - Number(reports[0].statistics.average.mic)) * 20, Standard: 20 },
    { subject: 'Length', Batch: Number(reports[0].statistics.average.sl2) * 80, Standard: 90 },
  ] : [];

  return (
    <section id="analytics" className="py-32 bg-slate-900/40 relative overflow-hidden max-w-full">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div className="max-w-3xl min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-blue-600/10 rounded border border-blue-500/20">
                <span className="text-[9px] font-black tracking-[0.4em] text-blue-600 dark:text-blue-500 uppercase">Analysis Intelligence v5.0</span>
              </div>
              <div className="h-[1px] w-24 bg-slate-800"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tighter uppercase text-slate-900 dark:text-white leading-[0.9]">Strategic <br/> Fiber Insights</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Cross-batch correlation engines. Detect quality drift and validate supplier consistency.</p>
          </div>
          
          <div className="flex flex-wrap bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-3xl shadow-2xl">
             {[
               { id: 'correlation', icon: ScatterIcon, label: 'Correlation' },
               { id: 'consistency', icon: BarChart3, label: 'Consistency' },
               { id: 'radar', icon: Scale, label: 'Benchmarks' }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
               >
                 <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Chart HUD */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] relative overflow-hidden group shadow-2xl min-w-0">
            {!isPro && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-md p-6 sm:p-10 text-center">
                 <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-8 border border-blue-500/20">
                    <Zap className="w-10 h-10 text-blue-500" />
                 </div>
                 <h3 className="text-2xl sm:text-3xl font-black mb-4 uppercase text-slate-900 dark:text-white">Professional Insights Locked</h3>
                 <button onClick={onUpgradeTrigger} className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-600/20">Initialize Upgrade</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
              <div className="space-y-1 min-w-0">
                <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tighter flex items-center gap-4 text-slate-900 dark:text-white truncate">
                  <div className="p-2 bg-blue-600/10 rounded-lg shrink-0"><Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" /></div>
                  <span className="truncate">
                    {activeTab === 'correlation' && 'Quality Correlation Map'}
                    {activeTab === 'consistency' && 'Bale Sequencing Analysis'}
                    {activeTab === 'radar' && 'Global Performance Index'}
                  </span>
                </h3>
              </div>
            </div>
            
            <div className="h-[350px] sm:h-[500px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'correlation' ? (
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis type="number" dataKey="x" name="Micronaire" unit="mic" stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                    <YAxis type="number" dataKey="y" name="Strength" unit="g/tex" stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                    <ZAxis type="number" dataKey="z" range={[100, 1500]} name="SCI" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }} />
                    <Scatter name="Bales" data={scatterData} fill="#3b82f6" fillOpacity={0.4} stroke="#3b82f6" strokeWidth={2}>
                       <LabelList dataKey="batch" position="top" style={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
                    </Scatter>
                  </ScatterChart>
                ) : activeTab === 'consistency' ? (
                  <AreaChart data={consistencyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                      <linearGradient id="colorSci" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="index" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={[120, 160]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                    <Area type="monotone" dataKey="sci" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSci)" />
                  </AreaChart>
                ) : (
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-800" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: '900' }} />
                    <PolarRadiusAxis axisLine={false} tick={false} domain={[0, 150]} />
                    <Radar name="Current Batch" dataKey="Batch" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="Industry Standard" dataKey="Standard" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strategic Insight Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8 w-full min-w-0">
            <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] flex flex-col h-full relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Activity className="w-32 h-32 sm:w-40 sm:h-40" />
              </div>

              <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Batch Verdict</h3>
              </div>

              <div className="space-y-6 sm:space-y-8 relative z-10">
                <div className="p-6 sm:p-8 bg-white/5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group">
                   <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Stability Index</div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                   </div>
                   <div className="flex items-end gap-3 mb-3">
                      <div className="text-4xl sm:text-5xl font-black group-hover:text-blue-400 transition-colors">98.2</div>
                      <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-widest">/ 100</div>
                   </div>
                   <p className="text-xs text-slate-400 font-bold leading-relaxed">Batch demonstrates elite uniformity. CV% within safe limits.</p>
                </div>
              </div>

              <div className="mt-auto pt-10 flex justify-center relative z-10">
                 <button onClick={onUpgradeTrigger} className="group text-[10px] sm:text-[11px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all flex items-center gap-3">
                   EXPLORE LAB PROTOCOLS 
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Ticker - Constrained to prevent overflow */}
        <div className="mt-12 flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-lg p-1 max-w-full">
           <div className="bg-slate-900 dark:bg-blue-600 text-white px-4 sm:px-6 py-4 flex items-center gap-3 rounded-xl shrink-0 z-10">
              <Globe className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Market Context</span>
           </div>
           <div className="flex-1 flex items-center px-8 overflow-hidden whitespace-nowrap relative">
              <div className="animate-marquee whitespace-nowrap">
                 {[
                   { label: 'Upland Benchmark', val: '82.4¢', change: '+1.2%' },
                   { label: 'Pima Superior', val: '142.1¢', change: '-0.4%' },
                   { label: 'HVI Grade 31-1', val: 'STABLE', change: '0.0%' },
                   { label: 'Global Inventory', val: '9.2M BALES', change: 'NEW HIGH' },
                   // Repeat for seamless scroll
                   { label: 'Upland Benchmark', val: '82.4¢', change: '+1.2%' },
                   { label: 'Pima Superior', val: '142.1¢', change: '-0.4%' },
                   { label: 'HVI Grade 31-1', val: 'STABLE', change: '0.0%' },
                   { label: 'Global Inventory', val: '9.2M BALES', change: 'NEW HIGH' }
                 ].map((tick, i) => (
                   <div key={i} className="inline-flex items-center gap-3 border-r border-slate-100 dark:border-white/5 pr-12 mr-12 last:border-0 last:mr-0 last:pr-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tick.label}</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{tick.val}</span>
                      <span className={`text-[9px] font-bold ${tick.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>{tick.change}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
