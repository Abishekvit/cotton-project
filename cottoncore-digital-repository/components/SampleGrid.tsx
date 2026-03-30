
import React, { useState } from 'react';
import { METRIC_CONFIGS, COTTON_TYPES, COTTON_SUBTYPES } from '../constants';
import { CottonReport } from '../types';
import { Lock, Hash, Layers, FileText, Database, PackageSearch, Activity, Wifi, ShieldAlert } from 'lucide-react';

const ReportCard: React.FC<{ report: CottonReport; isLocked: boolean; onUnlock: () => void; onClick: (r: CottonReport) => void }> = ({ report, isLocked, onUnlock, onClick }) => {
  const avg = report.statistics?.average || {};
  
  const fallbackImg = "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?q=80&w=800";
  const displayImg = report.bales?.[0]?.photos?.normal?.[0] || fallbackImg;

  return (
    <div 
      onClick={() => !isLocked && onClick(report)}
      className="group relative bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-950">
        <img 
          src={displayImg} 
          alt={report.report_id} 
          className={`w-full h-full object-cover transition-all duration-700 ${isLocked ? 'blur-xl opacity-30 grayscale' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}`}
        />
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
          <div className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded uppercase tracking-widest shadow-lg">
            {report.cotton_yarn_count}
          </div>
          <div className="px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded uppercase tracking-widest shadow-lg">
            {report.sub_type}
          </div>
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded text-[10px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-white/10 z-10">
          {report.report_id.slice(-8)}
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onUnlock(); }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 transition-colors"
            >
              SIGN IN
            </button>
          </div>
        )}
      </div>
      
      {!isLocked && (
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-lg leading-tight mb-1 text-slate-900 dark:text-white uppercase tracking-tighter text-ellipsis overflow-hidden">Batch Matrix</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{report.bales?.length || 0} Bales Verified</p>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 shrink-0">
              <Database className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 dark:border-white/5 pt-4">
            {METRIC_CONFIGS.slice(0, 4).map((m) => (
              <div key={m.key}>
                <div className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider mb-0.5">{m.label} μ</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-200">
                    {avg[m.key] ? Number(avg[m.key]).toFixed(2) : 'N/A'}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-600 font-bold">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface SampleGridProps {
  isAuthenticated: boolean;
  reports: CottonReport[];
  onAuthTrigger: () => void;
  onSampleClick: (r: CottonReport) => void;
  isSimulated?: boolean;
}

const SampleGrid: React.FC<SampleGridProps> = ({ isAuthenticated, reports, onAuthTrigger, onSampleClick, isSimulated }) => {
  const [filter, setFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('All');

  const filteredReports = (reports || []).filter(r => {
    const matchesSearch = r.report_id?.toLowerCase().includes(filter.toLowerCase()) || r.sub_type?.toLowerCase().includes(filter.toLowerCase());
    const matchesType = selectedType === 'All' || r.cotton_yarn_count === selectedType;
    const matchesSubtype = selectedSubtype === 'All' || r.sub_type === selectedSubtype;
    return matchesSearch && matchesType && matchesSubtype;
  });

  return (
    <section id="repository" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isSimulated ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-green-500/10 text-green-600 border border-green-500/20'}`}>
              {isSimulated ? <ShieldAlert className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              {isSimulated ? 'Source: Local Simulation' : 'Source: Remote Uplink'}
            </div>
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight uppercase text-slate-900 dark:text-white">Batch Repository</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Classified digital twin repository. Showing fiber datasets from validated HVI laboratory batches.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-40">
             <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
             <select 
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-colors dark:text-white appearance-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
             >
               <option value="All">All Counts</option>
               {COTTON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
             </select>
          </div>
          <div className="relative w-full sm:w-40">
             <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
             <select 
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-colors dark:text-white appearance-none cursor-pointer"
              value={selectedSubtype}
              onChange={(e) => setSelectedSubtype(e.target.value)}
             >
               <option value="All">All Sub-Types</option>
               {COTTON_SUBTYPES.map(t => <option key={t} value={t}>{t}</option>)}
             </select>
          </div>
          <div className="relative w-full sm:w-48">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="SEARCH ID..." 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-black tracking-widest focus:outline-none focus:border-blue-500/50 transition-colors dark:text-white uppercase"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReports.map((report) => (
            <ReportCard 
              key={report.report_id} 
              report={report} 
              isLocked={!isAuthenticated} 
              onUnlock={onAuthTrigger}
              onClick={onSampleClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
          <PackageSearch className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">No Samples Detected</h3>
          <p className="text-slate-500 max-w-sm mt-2 font-medium">We couldn't find any reports matching your filters or in your source dataset.</p>
        </div>
      )}
    </section>
  );
};

export default SampleGrid;
