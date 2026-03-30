
import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, ChevronRight, AlertCircle, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const m = motion as any;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <m.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Usage Agreement</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Pro Analyst Protocol v4.2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar font-sans">
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> 01. Data Integrity & Privacy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              By upgrading to the Pro Analyst tier, you acknowledge that all HVI fiber data uploaded to the private repository is subject to our end-to-end encryption protocols. CottonCore does not claim ownership of your proprietary fiber metrics but reserves the right to use anonymized aggregate data for global benchmark calibration.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> 02. Laboratory Responsibility
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              The Pro Analyst tools (Fiber Predictor and Lab Ingestion) are decision-support systems. Final industrial yarn count determinations and spinning settings remain the sole responsibility of the laboratory director and mill engineers.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" /> 03. Billing & Subscription
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Your subscription will be billed monthly via the secure Razorpay gateway. You may cancel at any time via the User Dashboard. No refunds are provided for partial months already utilized within the Pro tier.
            </p>
          </section>

          <div className="p-6 bg-blue-600/5 rounded-[2rem] border border-blue-500/10 flex items-start gap-4">
            <div className="p-2 bg-blue-600 rounded-xl mt-1 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 dark:text-blue-300/60 leading-relaxed uppercase tracking-tight">
              I certify that I am authorized to bind my laboratory/entity to these terms and that the terminal used for this upgrade is a verified industrial node.
            </p>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            Accept & Proceed to Payment
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </m.div>
    </div>
  );
};

export default TermsModal;
