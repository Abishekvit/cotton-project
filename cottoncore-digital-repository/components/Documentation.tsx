
import React from 'react';
import { BookOpen, Terminal, Download, FileJson, Layers, ClipboardCheck, Info, Cpu, Activity, Ruler, Zap, Droplets, Target, ShieldCheck } from 'lucide-react';

const Documentation: React.FC = () => {
  const glossary = [
    { key: 'SCI', icon: Activity, desc: 'Spinning Consistency Index. A mathematical model calculating overall processability based on multiple HVI properties.' },
    { key: 'Mic', icon: Ruler, desc: 'Micronaire. Measures fiber fineness and maturity. Essential for preventing neps and ensuring dye uniformity.' },
    { key: 'Str', icon: Zap, desc: 'Strength. Force required to break a bundle of fibers. Directly determines the maximum speed of spinning rotors.' },
    { key: 'UR', icon: Target, desc: 'Uniformity Ratio. The ratio of the mean length to the upper half mean length. Higher UR leads to smoother yarn.' },
    { key: 'SFI', icon: ShieldCheck, desc: 'Short Fiber Index. Percentage of fibers shorter than 0.5 inches. High SFI causes excessive waste.' },
    { key: 'Mst', icon: Droplets, desc: 'Moisture. Percentage of water by weight. Crucial for electrostatic control during high-speed carding.' },
    { key: 'Rd / +b', icon: Layers, desc: 'Reflectance & Yellowness. Used for color grading. Determines the brightness and color category.' }
  ];

  return (
    <section id="docs" className="py-32 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Scientific Glossary Sidebar */}
          <div className="lg:w-2/5">
            <div className="sticky top-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">The Science <br/> of Fiber</h2>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Laboratory Protocol Guide</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {glossary.map(item => (
                  <div key={item.key} className="group p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-500/30 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-3">
                       <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <item.icon className="w-5 h-5" />
                       </div>
                       <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{item.key}</h4>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Methodology & Content */}
          <div className="lg:w-3/5 space-y-24">
            <div className="space-y-12">
              <div className="flex items-center gap-5">
                <div className="h-[2px] w-12 bg-blue-600"></div>
                <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Analysis Framework</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 inline-block">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-black text-xl uppercase text-slate-900 dark:text-white tracking-tighter">01. Triple-View Matrix</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Our platform utilizes multi-perspective documentation: <strong>Ultra-Zoom</strong> (Fiber Texture), <strong>Standard</strong> (Color/Grade), and <strong>Wide-Angle</strong> (Trash Clusters). This visual triangulation creates a forensic "Digital Twin" for every bale.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 inline-block">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-black text-xl uppercase text-slate-900 dark:text-white tracking-tighter">02. CV% Stabilization</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Averages hide risks. We focus on the <strong>Coefficient of Variation (CV%)</strong>. By tracking the deviation across 50-200 bales, we predict potential yarn unevenness before the first spindle turns.
                  </p>
                </div>
              </div>

              <div className="p-10 bg-slate-900 dark:bg-blue-600/5 border border-slate-800 dark:border-blue-600/20 rounded-[3rem] flex items-center gap-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target className="w-40 h-40 text-white" />
                </div>
                <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/30 shrink-0">
                   <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="relative z-10">
                   <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Industrial Thresholds</h4>
                   <p className="text-sm text-slate-400 dark:text-blue-200/60 font-bold max-w-lg leading-relaxed">
                     Standard fine counts (40s to 60s) require a Minimum Strength of <strong>31.5 g/tex</strong> and Uniformity <strong>&gt;82.5%</strong> to maintain 98% rotor efficiency.
                   </p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5">
                  <Download className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Data Portability</h3>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Interoperable Laboratory Exports</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-8 py-6 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <Terminal className="w-5 h-5 text-blue-500" />
                    <span className="text-[11px] font-mono font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">protocol-export-v4.json</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                  </div>
                </div>
                <div className="p-8 overflow-x-auto bg-[#020617]">
                  <pre className="font-mono text-xs text-blue-400 leading-relaxed">
{`{
  "header": {
    "protocol": "HVI-S",
    "timestamp": "${new Date().toISOString()}",
    "checksum": "0x4F22B"
  },
  "metrics": {
    "sci_average": 145.2,
    "mic_cv_pct": 2.41,
    "strength_standard": "PREMIUM",
    "uniformity_index": 83.4
  },
  "verdict": "VALIDATED_FOR_RING_SPINNING"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documentation;
