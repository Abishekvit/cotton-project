
import React, { useState, useRef } from 'react';
import { Upload, Database, FileText, CheckCircle2, AlertTriangle, Cpu, Terminal as TerminalIcon, Image as ImageIcon, Check, Search, ShieldCheck, Lock, AlertCircle, RefreshCw, Hash, ZoomIn, Camera, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COTTON_TYPES } from '../constants';

interface LabPortalProps {
  user: string | null;
  tier: string;
  onNotify?: (msg: string) => void;
}

const LabPortal: React.FC<LabPortalProps> = ({ user, tier, onNotify }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [uploadedJsonName, setUploadedJsonName] = useState<string | null>(null);
  const [images, setImages] = useState<{zoomed: string|null, normal: string|null, longShot: string|null}>({
    zoomed: null, normal: null, longShot: null
  });
  const [isVerified, setIsVerified] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("40s");
  
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const zoomedRef = useRef<HTMLInputElement>(null);
  const normalRef = useRef<HTMLInputElement>(null);
  const longRef = useRef<HTMLInputElement>(null);

  // Cast motion object to any to avoid property errors on shorthand elements
  const m = motion as any;

  const steps = [
    "Initializing Perspective Processing...",
    "Scanning Long Shot for Trash Clusters...",
    "Mapping HD Zoomed Fiber Texture...",
    "Validating Normal HVI Reference...",
    "Syncing Digital Twin Matrix..."
  ];

  const handleImageUpload = (key: 'zoomed' | 'normal' | 'longShot') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => ({ ...prev, [key]: event.target?.result as string }));
        onNotify?.(`${key.toUpperCase()} perspective captured`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngest = async () => {
    if (!images.zoomed || !images.normal || !images.longShot) {
      onNotify?.("Error: Missing perspective documentation");
      return;
    }
    
    setIsScanning(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length - 1) {
        step++;
        setScanStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setIsVerified(true);
          onNotify?.(`Digital Twin for ${selectedType} batch created.`);
        }, 1500);
      }
    }, 1000);
  };

  const resetPortal = () => {
    setImages({ zoomed: null, normal: null, longShot: null });
    setUploadedJsonName(null);
    setIsVerified(false);
    setScanStep(0);
  };

  if (tier !== 'Pro') {
    return (
      <div className="h-screen flex items-center justify-center p-12">
        <div className="hud-border glass-terminal p-12 rounded-3xl border border-blue-500/20 text-center max-w-lg">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4 uppercase text-slate-900 dark:text-white">Pro Access Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">Digital Twin Ingestion is restricted to Enterprise tiers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-[2px] bg-blue-600"></div>
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 dark:text-blue-500 uppercase">Multi-Perspective Sync</span>
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">Lab Ingestion v2.0</h1>
              <p className="text-slate-600 dark:text-slate-500 max-w-xl font-medium">Upload the triple-view matrix for your {selectedType} batch to create a verifiable digital twin.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cotton Count / Type</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
                >
                  {COTTON_TYPES.map(t => <option key={t} value={t}>{t} Count</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="hud-border glass-terminal p-10 rounded-3xl relative overflow-hidden group shadow-2xl min-h-[500px]">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <m.div 
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-24"
                >
                  <div className="relative w-64 h-64 border-2 border-blue-500/10 dark:border-blue-500/20 rounded-full flex items-center justify-center mb-12">
                    <div className="absolute inset-0 scanner-line rounded-full opacity-50"></div>
                    <Database className="w-16 h-16 text-blue-600 dark:text-blue-500 animate-pulse" />
                  </div>
                  <div className="text-center space-y-4">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase block">AI ANALYSIS IN PROGRESS</span>
                    <h3 className="text-xl font-black mono text-slate-900 dark:text-white">{steps[scanStep]}</h3>
                  </div>
                </m.div>
              ) : isVerified ? (
                <m.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-20 text-center"
                >
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                    <ShieldCheck className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-4xl font-black mb-4 uppercase text-slate-900 dark:text-white">Repository Synced</h3>
                  <p className="text-slate-500 max-w-md font-medium mb-10">Triple-view perspective verified for {selectedType} count. All metrics pushed to secure global archive.</p>
                  <button onClick={resetPortal} className="bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all">
                    INGEST NEXT BATCH
                  </button>
                </m.div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Zoomed HD Upload */}
                    <div 
                      onClick={() => zoomedRef.current?.click()}
                      className={`relative aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-600/5 overflow-hidden ${images.zoomed ? 'border-green-500/40 bg-green-500/5' : 'border-slate-200 dark:border-white/10'}`}
                    >
                      <input type="file" ref={zoomedRef} onChange={handleImageUpload('zoomed')} className="hidden" />
                      {images.zoomed ? (
                        <>
                          <img src={images.zoomed} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center">
                            <Check className="w-10 h-10 text-green-600 mb-2" />
                            <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Zoomed HD Ready</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ZoomIn className="w-10 h-10 text-slate-400 mb-4" />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Zoomed HD</span>
                          <span className="text-[8px] text-slate-400 uppercase mt-1">Fiber Fineness</span>
                        </>
                      )}
                    </div>

                    {/* Normal View Upload */}
                    <div 
                      onClick={() => normalRef.current?.click()}
                      className={`relative aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-600/5 overflow-hidden ${images.normal ? 'border-green-500/40 bg-green-500/5' : 'border-slate-200 dark:border-white/10'}`}
                    >
                      <input type="file" ref={normalRef} onChange={handleImageUpload('normal')} className="hidden" />
                      {images.normal ? (
                        <>
                          <img src={images.normal} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center">
                            <Check className="w-10 h-10 text-green-600 mb-2" />
                            <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Normal View Ready</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Focus className="w-10 h-10 text-slate-400 mb-4" />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Normal View</span>
                          <span className="text-[8px] text-slate-400 uppercase mt-1">HVI Reference</span>
                        </>
                      )}
                    </div>

                    {/* Long Shot Upload */}
                    <div 
                      onClick={() => longRef.current?.click()}
                      className={`relative aspect-square border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-600/5 overflow-hidden ${images.longShot ? 'border-green-500/40 bg-green-500/5' : 'border-slate-200 dark:border-white/10'}`}
                    >
                      <input type="file" ref={longRef} onChange={handleImageUpload('longShot')} className="hidden" />
                      {images.longShot ? (
                        <>
                          <img src={images.longShot} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center">
                            <Check className="w-10 h-10 text-green-600 mb-2" />
                            <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Long Shot Ready</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Camera className="w-10 h-10 text-slate-400 mb-4" />
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Long Shot</span>
                          <span className="text-[8px] text-slate-400 uppercase mt-1">Trash & Dust Map</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-10 border-t border-slate-200 dark:border-white/5">
                    <button 
                      onClick={handleIngest}
                      disabled={!images.zoomed || !images.normal || !images.longShot}
                      className={`w-full max-w-md py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-4 transition-all ${(!images.zoomed || !images.normal || !images.longShot) ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white shadow-2xl hover:scale-105 active:scale-95'}`}
                    >
                      {(!images.zoomed || !images.normal || !images.longShot) ? <Lock className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
                      {(!images.zoomed || !images.normal || !images.longShot) ? 'COMPLETE VISUAL MATRIX' : 'SYNCHRONIZE DIGITAL TWIN'}
                    </button>
                    <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pro AI Verification Active</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPortal;
