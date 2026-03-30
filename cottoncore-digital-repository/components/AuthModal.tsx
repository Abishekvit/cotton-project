
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, ChevronRight, Beaker, ShieldCheck, Zap, Loader2, UserPlus, Github, Twitter, Sparkles } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider, githubProvider, twitterProvider} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, isPro: boolean) => void;
  isUpgradeFlow?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, isUpgradeFlow = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(isUpgradeFlow);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to Sign Up if we are upgrading
  useEffect(() => {
    if (isOpen) {
      setIsSignUp(isUpgradeFlow);
    }
  }, [isOpen, isUpgradeFlow]);

  if (!isOpen) return null;

  const handleProviderLogin = async (provider: any) => {
    if (!auth || !provider) {
      setError("Auth Service Unavailable. Verify your configuration.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const proEmails = ['2ravi5abi@gmail.com'];
      const isPro = proEmails.includes(user.email || '');
      onLogin(user.email || 'OAuth User', isPro);
    } catch (err: any) {
      console.error("[AuthModal] Provider error:", err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Authentication is not initialized.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      const isPro = user.email === '2ravi5abi@gmail.com';
      onLogin(user.email || 'User', isPro);
    } catch (err: any) {
      console.error("[AuthModal] Submit error:", err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPro = () => {
    setEmail('2ravi5abi@gmail.com');
    setPassword('12344321@abAA'); 
    setIsSignUp(false);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-[360px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            {isUpgradeFlow ? <Sparkles className="w-5 h-5 text-white" /> : <Beaker className="w-5 h-5 text-white" />}
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-center">
            {isUpgradeFlow 
              ? (isSignUp ? 'Upgrade: Step 1' : 'Verify Identity') 
              : (isSignUp ? 'Register Terminal' : 'Access Gate')}
          </h2>
          {isUpgradeFlow && isSignUp && (
            <p className="text-[10px] text-blue-600 dark:text-blue-500 font-bold uppercase tracking-widest mt-1">Create account to proceed to payment</p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold flex items-start gap-2 animate-shake">
            <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-center gap-4">
            <button onClick={() => handleProviderLogin(googleProvider)} disabled={isLoading} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-90 disabled:opacity-50 group">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google"/>
            </button>
            <button onClick={() => handleProviderLogin(githubProvider)} disabled={isLoading} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-90 disabled:opacity-50 group">
              <Github className="w-5 h-5 text-slate-700 dark:text-white group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => handleProviderLogin(twitterProvider)} disabled={isLoading} className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-90 disabled:opacity-50 group">
              <Twitter className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">secure gateway</span>
            <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" placeholder="Terminal ID" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-colors text-slate-900 dark:text-white" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="password" placeholder="Access Key" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-colors text-slate-900 dark:text-white" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all mt-4 shadow-xl active:scale-95 uppercase disabled:opacity-50">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                <>{isUpgradeFlow ? 'SIGN UP & CONTINUE' : 'REGISTER TERMINAL'} <UserPlus className="w-4 h-4" /></>
              ) : (
                <>{isUpgradeFlow ? 'LOGIN & CONTINUE' : 'AUTHORIZE SESSION'} <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[9px] font-black text-blue-600 dark:text-blue-500 hover:underline uppercase tracking-widest">
            {isSignUp ? 'Already have an account? Login' : 'New here? Create account'}
          </button>
          {!isUpgradeFlow && (
            <button onClick={handleQuickPro} className="group flex items-center gap-3 px-5 py-2.5 bg-blue-600/5 hover:bg-blue-600/10 border border-blue-500/20 rounded-full transition-all">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Auto-fill Admin Node</span>
            </button>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.2em]">
            CottonCore Encryption Node v4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
