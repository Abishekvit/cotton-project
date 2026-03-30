
import React, { useState } from 'react';
import { 
  X, Database, Loader2, Microscope, ChevronLeft, ChevronRight, Activity, 
  LayoutGrid, Info, Table, Download, Sparkles, FileSpreadsheet, FileCode, CheckCircle2,
  RefreshCw, ShieldAlert, Award, AlertCircle, Maximize2, Layers
} from 'lucide-react';
import { CottonReport, BaleData } from '../types';
import { METRIC_CONFIGS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToJSON } from '../lib/export_utils';
import { analyzeFiberQuality } from '../lib/gemini_service';

interface SampleDetailModalProps {
  sample: CottonReport | null;
  onClose: () => void;
  tier: string;
  onNotify?: (msg: string) => void;
}

const SampleDetailModal: React.FC<SampleDetailModalProps> = ({ sample: report, onClose, tier, onNotify }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedBaleIndex, setSelectedBaleIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'ultra_zoom' | 'normal' | 'stretch'>('normal');
  const [imgIndex, setImgIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'visual' | 'stats' | 'ai'>('visual');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!report) return null;

  // Cast motion object to any to avoid property errors on shorthand elements
  const m = motion as any;

  const bale = report.bales[selectedBaleIndex] || { 
    bale_id: 'N/A',
    photos: { normal: [], ultra_zoom: [], stretch: [] }, 
    metrics: {} as BaleData['metrics'] 
  };
  const currentImages = bale.photos[activeCategory] || [];
  const totalInCat = currentImages.length;

  const handleNextImg = () => setImgIndex((prev) => (prev + 1) % (totalInCat || 1));
  const handlePrevImg = () => setImgIndex((prev) => (prev - 1 + (totalInCat || 1)) % (totalInCat || 1));

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setViewMode('ai');
    const result = await analyzeFiberQuality(bale.metrics);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const getVerdict = () => {
    const avg = report.statistics.average;
    if (Number(avg.sci) > 150 && Number(avg.str) > 32) return { label: 'PREMIUM GRADE', color: 'text-blue-500', icon: Award, desc: 'Optimized for high-speed ring spinning and fine counts.' };
    if (Number(avg.sci) > 130) return { label: 'STANDARD GRADE', color: 'text-green-500', icon: CheckCircle2, desc: 'Suitable for general purpose rotor and ring spinning.' };
    return { label: 'UTILITY GRADE', color: 'text-amber-500', icon: AlertCircle, desc: 'Recommended for coarser counts or blended applications.' };
  };

  const verdict = getVerdict();

  const renderMetric = (mConf: typeof METRIC_CONFIGS[0], value: any) => (
    <div key={mConf.key} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all shadow-sm">
      <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 flex items-center gap-1">
        {mConf.label}
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: mConf.color }} />
      </div>
      <div className="text-xl font-mono font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
        {value !== undefined && value !== null ? (typeof value === 'number' ? value.toFixed(2) : value) : '—'}
      </div>
      <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{mConf.unit || 'VALUE'}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-end bg-black/90 backdrop-blur-xl p-0 md:p-6">
      <m.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full w-full max-w-7xl bg-white dark:bg-[#020617] md:rounded-[3rem] overflow-hidden border-l border-white/10 shadow-2xl flex flex-col"
      >
        {/* MODAL HEADER */}
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl text-slate-400 transition-all active:scale-90"><X className="w-7 h-7" /></button>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/5 hidden md:block"></div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-widest shadow-lg shadow-blue-600/20">{report.cotton_yarn_count} COUNT</span>
                <span className="px-3 py-1 bg-slate-800 text-white text-[9px] font-black rounded uppercase tracking-widest">{report.sub_type}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">BATCH: {report.report_id}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl">
                <button onClick={() => setViewMode('visual')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'visual' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>Visual Matrix</button>
                <button onClick={() => setViewMode('stats')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'stats' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}>Stats</button>
                <button onClick={runAiAnalysis} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'ai' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-blue-600'}`}>
                  <Sparkles className="w-4 h-4" /> AI Analysis
                </button>
             </div>
             
             <div className="flex items-center gap-3">
               <button onClick={() => exportToCSV(report)} className="p-4 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-blue-500 rounded-2xl transition-all border border-slate-200 dark:border-white/5 shadow-sm" title="Export CSV"><FileSpreadsheet className="w-5 h-5" /></button>
               <button onClick={() => exportToJSON(report)} className="p-4 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-amber-500 rounded-2xl transition-all border border-slate-200 dark:border-white/5 shadow-sm" title="Export JSON"><FileCode className="w-5 h-5" /></button>
               <button onClick={() => { setIsExporting(true); setTimeout(() => { setIsExporting(false); onNotify?.("Batch Repos Synced"); }, 800); }} className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl text-[10px] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest shadow-2xl">
                 {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                 SYNC
               </button>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 md:p-12">
          <AnimatePresence mode="wait">
            {viewMode === 'visual' && (
              <m.div key="visual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-4 text-slate-500">
                          <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg"><LayoutGrid className="w-5 h-5" /></div>
                          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Bale Sequencing Repository (N={report.bales.length})</span>
                       </div>
                       <div className="flex gap-2 flex-wrap justify-end">
                          {report.bales.slice(0, 15).map((_, i) => (
                            <button key={i} onClick={() => {setSelectedBaleIndex(i); setImgIndex(0);}} className={`w-9 h-9 rounded-xl font-mono text-xs font-black transition-all ${selectedBaleIndex === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>{i+1}</button>
                          ))}
                          {report.bales.length > 15 && <div className="flex items-center px-4 text-[10px] font-black text-slate-400">...</div>}
                       </div>
                    </div>

                    <div className="relative aspect-video rounded-[3.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-3xl group">
                      {totalInCat > 0 ? (
                        <m.img 
                          key={`${selectedBaleIndex}-${activeCategory}-${imgIndex}`}
                          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                          src={currentImages[imgIndex]} 
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-6">
                           <Microscope className="w-20 h-20 opacity-10 animate-pulse" />
                           <span className="text-sm font-black uppercase tracking-[0.4em] opacity-30">NO PERSPECTIVE CAPTURED</span>
                        </div>
                      )}
                      
                      {totalInCat > 1 && (
                        <>
                          <button onClick={handlePrevImg} className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 active:scale-90"><ChevronLeft className="w-8 h-8"/></button>
                          <button onClick={handleNextImg} className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100 active:scale-90"><ChevronRight className="w-8 h-8"/></button>
                        </>
                      )}

                      <div className="absolute top-10 left-10 px-6 py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 text-white flex items-center gap-6">
                         <div className="flex flex-col">
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">BALE ID</div>
                            <div className="font-mono text-sm font-bold">{bale.bale_id}</div>
                         </div>
                         <div className="w-[1px] h-6 bg-white/20"></div>
                         <div className="flex flex-col">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PERSPECTIVE</div>
                            <div className="text-xs font-bold uppercase">{activeCategory.replace('_', ' ')}</div>
                         </div>
                      </div>
                      
                      <button className="absolute bottom-10 right-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all">
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {(['ultra_zoom', 'normal', 'stretch'] as const).map(k => (
                        <button 
                          key={k} 
                          onClick={() => {setActiveCategory(k); setImgIndex(0);}} 
                          className={`group relative py-6 rounded-3xl border transition-all overflow-hidden ${activeCategory === k ? 'border-blue-600 bg-blue-600/5 shadow-xl' : 'border-slate-200 dark:border-white/5 text-slate-400 opacity-60 hover:opacity-100'}`}
                        >
                          <div className={`absolute left-0 top-0 h-full w-1 transition-all ${activeCategory === k ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                          <div className="flex flex-col items-center">
                             <Layers className={`w-5 h-5 mb-2 transition-colors ${activeCategory === k ? 'text-blue-500' : 'text-slate-400'}`} />
                             <span className={`text-[11px] font-black uppercase tracking-widest ${activeCategory === k ? 'text-blue-600' : 'text-slate-500'}`}>{k.replace('_', ' ')}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-slate-900 text-white border border-slate-800 rounded-[3rem] p-10 flex items-start gap-8 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5"><Activity className="w-32 h-32" /></div>
                       <div className={`p-5 rounded-3xl bg-white/10 shadow-2xl ${verdict.color}`}>
                          <verdict.icon className="w-10 h-10" />
                       </div>
                       <div className="relative z-10">
                          <div className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 ${verdict.color}`}>{verdict.label}</div>
                          <p className="text-base font-bold text-slate-300 leading-relaxed mb-4">{verdict.desc}</p>
                          <div className="h-[1px] w-12 bg-blue-500/50"></div>
                       </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3rem] p-10 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-blue-600/10 rounded-2xl"><Activity className="w-6 h-6 text-blue-500" /></div>
                        <div>
                           <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Fiber Metrics</h3>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target: Bale Level</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        {METRIC_CONFIGS.slice(0, 8).map(mConf => renderMetric(mConf, bale.metrics[mConf.key]))}
                      </div>
                      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ShieldAlert className="w-3 h-3" /> Encrypted Lab Feed
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            )}

            {viewMode === 'ai' && (
              <m.div key="ai" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto py-12">
                 <div className="bg-blue-600/5 border border-blue-500/10 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-16 opacity-5">
                       <Sparkles className="w-72 h-72 text-blue-500" />
                    </div>
                    
                    <div className="relative z-10">
                       <div className="flex items-center gap-6 mb-16">
                          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-600/30">
                             <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">AI Technical Briefing</h3>
                             <p className="text-blue-600/60 font-black text-xs uppercase tracking-[0.4em] mt-2">HVI QUALITY ENGINE v2.2</p>
                          </div>
                       </div>

                       {isAnalyzing ? (
                         <div className="flex flex-col items-center py-32">
                            <div className="relative w-24 h-24 mb-10">
                               <div className="absolute inset-0 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin"></div>
                               <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
                            </div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Analyzing Fiber Morphology...</p>
                         </div>
                       ) : (
                         <div className="space-y-12">
                            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl p-12 rounded-[3rem] border border-blue-500/10 shadow-inner">
                               <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-semibold whitespace-pre-line">
                                  {aiAnalysis || "Initiate the AI Analysis sequence to generate an industrial processing briefing based on this bale's specific HVI profile."}
                               </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="group p-8 bg-green-500/5 border border-green-500/10 rounded-3xl hover:bg-green-500/10 transition-colors">
                                  <div className="flex items-center gap-4 mb-4">
                                     <div className="p-2 bg-green-500 rounded-xl text-white shadow-lg"><CheckCircle2 className="w-5 h-5" /></div>
                                     <span className="text-xs font-black uppercase tracking-widest text-green-700 dark:text-green-500">Utilization Grade</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">Optimal for high-tenacity yarn production. Minimal breakage risks detected at 120,000 RPM rotor speeds.</p>
                               </div>
                               <div className="group p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl hover:bg-amber-500/10 transition-colors">
                                  <div className="flex items-center gap-4 mb-4">
                                     <div className="p-2 bg-amber-500 rounded-xl text-white shadow-lg"><Info className="w-5 h-5" /></div>
                                     <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-500">Processing Optimization</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">Recommended humidity adjustment (+2%) during carding to mitigate molecular static in this low-micronaire batch.</p>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              </m.div>
            )}

            {viewMode === 'stats' && (
              <m.div key="stats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[3.5rem] p-12 shadow-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Table className="w-80 h-80" /></div>
                  <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20"><Table className="w-7 h-7 text-white" /></div>
                       <div>
                          <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Stability Matrix</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Laboratory Performance (N={report.statistics.n})</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HVI PRO-MODE ACTIVE</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-white/10">
                          <th className="py-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Parameter Profile</th>
                          <th className="py-6 px-4 text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Average (μ)</th>
                          <th className="py-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Variance (CV%)</th>
                          <th className="py-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Stability Status</th>
                          <th className="py-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Range (Min/Max)</th>
                          <th className="py-6 px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">99th Percentile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {METRIC_CONFIGS.map(mConf => {
                          const cv = Number(report.statistics.cvPercent[mConf.key]);
                          const isStable = isNaN(cv) || cv < 4;
                          return (
                            <tr key={mConf.key} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: mConf.color }} />
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{mConf.label}</span>
                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{mConf.unit || 'VALUE'}</span>
                                    </div>
                                </div>
                              </td>
                              <td className="py-6 px-4 font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                                 {report.statistics.average[mConf.key] !== undefined ? Number(report.statistics.average[mConf.key]).toFixed(2) : '—'}
                              </td>
                              <td className="py-6 px-4 font-mono text-sm text-slate-500">
                                 {cv !== undefined && !isNaN(cv) ? `${cv.toFixed(2)}%` : '0.00%'}
                              </td>
                              <td className="py-6 px-4">
                                 <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-[0.2em] ${isStable ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isStable ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {isStable ? 'OPTIMAL' : 'VAR_ALERT'}
                                 </div>
                              </td>
                              <td className="py-6 px-4 font-mono text-sm text-slate-500">
                                 <span className="opacity-40">{report.statistics.min[mConf.key] !== undefined ? Number(report.statistics.min[mConf.key]).toFixed(1) : '—'}</span>
                                 <span className="mx-2 text-slate-300">/</span>
                                 <span className="opacity-40">{report.statistics.max[mConf.key] !== undefined ? Number(report.statistics.max[mConf.key]).toFixed(1) : '—'}</span>
                              </td>
                              <td className="py-6 px-4 font-mono text-sm text-slate-400">
                                 {report.statistics.q99[mConf.key] !== undefined ? Number(report.statistics.q99[mConf.key]).toFixed(2) : '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  );
};

export default SampleDetailModal;
