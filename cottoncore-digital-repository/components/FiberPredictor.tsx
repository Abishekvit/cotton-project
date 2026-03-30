
import React, { useState, useRef } from 'react';
import { Upload, Camera, Zap, ShieldCheck, AlertCircle, RefreshCw, Cpu, Brain, CheckCircle2, XCircle, Info, Layers, Terminal, Activity, Eye, Target, Image as ImageIcon, Server, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictFiberCount } from '../lib/gemini_service';
import { predictWithCustomModel } from '../lib/custom_model_service';

interface FiberPredictorProps {
  user: string | null;
  tier: string;
  onNotify?: (msg: string) => void;
}

const FiberPredictor: React.FC<FiberPredictorProps> = ({ user, tier, onNotify }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [inferenceLogs, setInferenceLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelType, setModelType] = useState<'gemini' | 'custom'>('gemini');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cast motion object to any to avoid property errors on shorthand elements
  const m = motion as any;

  const mockLogs = [
    "Initializing Neural Kernel...",
    "Segmenting Fiber Boundaries...",
    "Extracting Morphological Features...",
    "Calculating Convolution Frequency...",
    "Inference sequence initiated...",
    "Calibrating Confidence Scores..."
  ];

  const toggleCamera = async () => {
    if (isCameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        onNotify?.("Camera access denied.");
      }
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImage(dataUrl);
      toggleCamera();
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setError(null);
        onNotify?.("Batch image loaded.");
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsScanning(true);
    setResult(null);
    setError(null);
    setInferenceLogs([]);
    
    for (let i = 0; i < mockLogs.length; i++) {
      setInferenceLogs(prev => [...prev, mockLogs[i]]);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      let prediction;
      if (modelType === 'gemini') {
        prediction = await predictFiberCount(image);
      } else {
        prediction = await predictWithCustomModel(image);
      }
      setResult(prediction);
      onNotify?.("ML Inference complete.");
    } catch (err: any) {
      setError(err.message || "Inference engine timed out.");
      onNotify?.("Error: " + (err.message || "Inference failed"));
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setInferenceLogs([]);
  };

  return (
    <div className="min-h-screen p-8 md:p-16 lg:p-24 bg-slate-50 dark:bg-slate-950/40">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="px-3 py-1 bg-blue-600/10 rounded border border-blue-500/20">
                  <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 dark:text-blue-500 uppercase">Analysis Engine Config</span>
                </div>
                <div className="h-[1px] w-20 bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-slate-900 dark:text-white">
                ML Count <br/> <span className="text-blue-600">Predictor</span>
              </h1>
              
              {/* Model Switcher */}
              <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-white/10 w-fit mb-8 shadow-xl">
                <button 
                  onClick={() => setModelType('gemini')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${modelType === 'gemini' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  <Brain className="w-4 h-4" /> Gemini Vision
                </button>
                <button 
                  onClick={() => setModelType('custom')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${modelType === 'custom' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  <Server className="w-4 h-4" /> Custom .pth
                </button>
              </div>

              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                {modelType === 'gemini' 
                  ? "Advanced Convolutional Analysis powered by Gemini Multimodal transformers for generalized 40s Grade verification."
                  : "Private local classification using your proprietary ResNet18 model for custom cotton type identification."}
              </p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="p-4 bg-blue-600/10 rounded-2xl"><Cpu className="w-8 h-8 text-blue-600" /></div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Compute Mode</h4>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{modelType === 'gemini' ? 'Cloud Transformer' : 'Local PyTorch Node'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                  <div className="p-4 bg-blue-600/10 rounded-2xl"><Target className="w-8 h-8 text-blue-600" /></div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Input Dimension</h4>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{modelType === 'gemini' ? 'Dynamic' : '224x224 RGB'}</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Terminal className="w-32 h-32" /></div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 flex items-center gap-2">
                 <Activity className="w-4 h-4" /> Terminal Log Output
               </h4>
               <div className="space-y-2 h-32 overflow-y-auto font-mono text-[11px] text-slate-400 scrollbar-hide">
                  {error && <div className="text-red-500">[ERROR] {error}</div>}
                  {inferenceLogs.length === 0 ? "> Awaiting input..." : inferenceLogs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                       <span className="text-blue-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                       <span className="text-slate-200">{log}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="hud-border glass-terminal p-8 sm:p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl flex-1 flex flex-col border border-blue-500/10">
              <AnimatePresence mode="wait">
                {isCameraActive ? (
                  <m.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-black border border-white/10 mb-8">
                       <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-110" />
                       <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500/50 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
                       </div>
                    </div>
                    <div className="flex gap-4 w-full">
                      <button onClick={captureFrame} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Capture Sample</button>
                      <button onClick={toggleCamera} className="px-8 py-5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
                    </div>
                  </m.div>
                ) : !image ? (
                  <m.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] p-10 text-center hover:border-blue-500/40 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                    <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                       <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Sample Ingestion</h3>
                    <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tight">Drop microscopic frame</p>
                    <button onClick={(e) => { e.stopPropagation(); toggleCamera(); }} className="mt-8 flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all">
                      <Camera className="w-4 h-4" /> Open Lens
                    </button>
                  </m.div>
                ) : (
                  <m.div key="inference" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col">
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black border border-white/10 group mb-10 shadow-3xl">
                       <img src={image} className="w-full h-full object-cover opacity-80" alt="Fiber Sample" />
                       {isScanning && (
                         <div className="absolute inset-0 z-20">
                           <m.div initial={{ top: "-10%" }} animate={{ top: "110%" }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-1 bg-blue-600 shadow-[0_0_30px_#3b82f6]" />
                           <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[1px]"></div>
                         </div>
                       )}
                       <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">Visual Input Buffer</span>
                       </div>
                       <button onClick={reset} className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white hover:bg-red-500/50 opacity-0 group-hover:opacity-100 transition-all">
                         <RefreshCw className="w-4 h-4" />
                       </button>
                    </div>

                    {!result && !isScanning ? (
                      <button onClick={startAnalysis} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all">
                        <Brain className="w-6 h-6" /> RUN {modelType.toUpperCase()} MODEL
                      </button>
                    ) : result ? (
                      <div className="space-y-8 flex-1">
                        <div className={`p-10 rounded-[2.5rem] flex items-center gap-10 ${result.prediction.includes('40s') || result.probability > 0.8 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                           <div className={`p-6 rounded-[2rem] shadow-2xl ${result.prediction.includes('40s') || result.probability > 0.8 ? 'bg-green-600' : 'bg-red-600'}`}>
                              {result.prediction.includes('40s') || result.probability > 0.8 ? <CheckCircle2 className="w-10 h-10 text-white" /> : <XCircle className="w-10 h-10 text-white" />}
                           </div>
                           <div>
                              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{modelType === 'gemini' ? 'AI PREDICTION' : 'PYTORCH VERDICT'}</div>
                              <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                                 {result.prediction.replace('_', ' ')}
                              </h3>
                              <div className="flex items-center gap-4 mt-4">
                                 <div className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-black text-blue-600 uppercase">Confidence: {(result.probability * 100).toFixed(1)}%</div>
                              </div>
                           </div>
                        </div>

                        {modelType === 'gemini' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Morphology</span>
                                <span className="text-lg font-black uppercase text-slate-900 dark:text-white">{result.morphology.maturity_visual} Wall</span>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Conv. Frequency</span>
                                <span className="text-lg font-black uppercase text-slate-900 dark:text-white">{result.morphology.convolution_rate}</span>
                            </div>
                          </div>
                        )}

                        <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-blue-500/10 text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-5"><Brain className="w-24 h-24" /></div>
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-blue-500">ML Reasoning Pathway</h4>
                           <p className="text-sm font-bold text-slate-300 leading-relaxed relative z-10 italic">"{result.reasoning}"</p>
                        </div>
                        
                        <button onClick={reset} className="w-full py-5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">CLEAR BUFFER</button>
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center">
                         <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-8"></div>
                         <h4 className="text-xl font-black uppercase text-slate-900 dark:text-white">Analyzing sample...</h4>
                      </div>
                    )}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FiberPredictor;
