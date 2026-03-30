
import React, { useState, useEffect, useRef } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import SampleGrid from './components/SampleGrid';
import AnalyticsSection from './components/AnalyticsSection';
import LabPortal from './components/LabPortal';
import FiberPredictor from './components/FiberPredictor';
import UserDashboard from './components/UserDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import TermsModal from './components/TermsModal.tsx';
import SampleDetailModal from './components/SampleDetailModal';
import PricingSection from './components/PricingSection';
import Documentation from './components/Documentation';
import ThemeToggle from './components/ThemeToggle';
import SpinningCottonBackground from './components/SpinningCottonBackground';
import { CottonReport } from './types';
import { fetchReports } from './lib/api_connector';
import { MOCK_REPORTS } from './constants';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Beaker, CheckCircle2, Wifi, Database, Activity, LayoutDashboard } from 'lucide-react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './lib/firebase';
import { initializePayment } from './lib/razorpay_service';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [tier, setTier] = useState<'Academic' | 'Pro'>('Academic');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [pendingUpgrade, setPendingUpgrade] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<CottonReport | null>(null);
  const [activeView, setActiveView] = useState<'terminal' | 'lab' | 'predictor' | 'dashboard'>('terminal');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  
  const [loginCount, setLoginCount] = useState(0);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const [reports, setReports] = useState<CottonReport[]>([]);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  const m = motion as any;

  const syncDatabase = async () => {
    if (isSimulated && reports.length > 0) return;
    setDbStatus('checking');
    const response = await fetchReports();
    if (response.success) {
      setReports(response.data);
      setDbStatus('connected');
      setIsSimulated(false);
      if (response.data.length > 0) {
        showNotification(`${response.data.length} Reports Synchronized`);
      }
    } else {
      setDbStatus('disconnected');
      if (reports.length === 0) {
        setReports(MOCK_REPORTS);
        setIsSimulated(true);
      }
    }
  };

  useEffect(() => {
    syncDatabase();
    const interval = setInterval(syncDatabase, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser.email);
          const isPro = firebaseUser.email === '2ravi5abi@gmail.com' || localStorage.getItem('cc_pro_tier') === 'true';
          setTier(isPro ? 'Pro' : 'Academic');
          
          const now = new Date().toISOString();
          setLastLogin(now);
          setLoginCount(prev => prev + 1);

          // If we had a pending upgrade, open terms modal instead of direct payment
          if (pendingUpgrade && !isPro) {
            setPendingUpgrade(false);
            setIsTermsModalOpen(true);
          }
        } else {
          setUser(null);
          setTier('Academic');
        }
      });
      return () => unsubscribe();
    }
  }, [pendingUpgrade]);

  const initiateProPayment = async () => {
    setIsTermsModalOpen(false);
    if (!user) return;
    
    try {
      await initializePayment({
        amount: 49,
        currency: "USD",
        name: "Pro Analyst",
        description: "CottonCore Pro Analyst Subscription",
        email: user,
        onSuccess: (response) => {
          handlePaymentSuccess();
        },
        onDismiss: () => {
          showNotification('Payment window closed');
        }
      });
    } catch (err) {
      showNotification('Payment initialization failed');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('cc_theme') as 'light' | 'dark';
    const savedTime = localStorage.getItem('cc_total_time');
    if (savedTheme) setTheme(savedTheme);
    const timeVal = parseInt(savedTime || "0");
    setTotalTimeSeconds(timeVal);
    timerRef.current = window.setInterval(() => {
      setTotalTimeSeconds(prev => {
        const next = prev + 1;
        localStorage.setItem('cc_total_time', next.toString());
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('cc_theme', theme);
  }, [theme]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (email: string, isPro: boolean) => {
    setUser(email);
    setTier(isPro ? 'Pro' : 'Academic');
    setIsAuthModalOpen(false);
    const now = new Date().toISOString();
    setLastLogin(now);
    setLoginCount(prev => prev + 1);
    showNotification(isPro ? 'Pro Session Initialized' : 'Academic Access Granted');
  };

  const handlePaymentSuccess = () => {
    setTier('Pro');
    localStorage.setItem('cc_pro_tier', 'true');
    showNotification('Payment Successful! Pro Tier Activated.');
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setUser(null);
      setTier('Academic');
      setActiveView('terminal');
      localStorage.removeItem('cc_pro_tier');
      showNotification('Session Terminated');
    } catch (error) {
      showNotification('Logout Failed');
    }
  };

  const scrollToSection = (id: string) => {
    if (activeView !== 'terminal') {
      setActiveView('terminal');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isPro = tier === 'Pro';

  return (
    <div className={`min-h-screen max-w-full overflow-x-hidden text-slate-900 dark:text-slate-100 flex selection:bg-blue-500/30 ${isPro ? '' : 'flex-col'}`}>
      <SpinningCottonBackground />
      <AnimatePresence>
        {notification && (
          <m.div key="notification" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-white/20">
            <CheckCircle2 className="w-5 h-5" />
            {notification}
          </m.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
        <div className="flex items-center gap-3 px-5 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-2xl pointer-events-auto">
          <div className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : dbStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {dbStatus === 'connected' ? 'API Uplink: Active' : dbStatus === 'checking' ? 'Establishing...' : 'Uplink: Failed'}
            </span>
          </div>
        </div>
      </div>

      {isPro && (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-24 border-r border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-[100] flex flex-col items-center py-10 justify-between shrink-0">
          <div onClick={() => setActiveView('terminal')} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.3)] cursor-pointer">
            <span className="font-black text-white text-xl">C</span>
          </div>
          <div className="flex flex-col items-center gap-6">
            <Navigation user={user} tier={tier} onAuthClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} activeView={activeView} onViewChange={setActiveView} />
            <ThemeToggle theme={theme} onToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />
          </div>
          <div onClick={() => setActiveView('dashboard')} className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-all">
            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user}`} alt="User" />
          </div>
        </aside>
      )}

      {!isPro && (
        <header className="fixed top-0 left-0 w-full z-[100] bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('terminal')}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">CottonCore</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {['Repository', 'Analytics', 'Pricing', 'Activity'].map(item => (
                <button key={item} onClick={() => item === 'Activity' ? setActiveView('dashboard') : scrollToSection(item.toLowerCase())} className={`text-sm font-bold transition-colors uppercase tracking-widest ${activeView === 'dashboard' && item === 'Activity' ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  {item}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle theme={theme} onToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />
              {!user ? (
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase hover:bg-slate-800 dark:hover:bg-slate-200 transition-all">Sign In</button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block cursor-pointer group" onClick={() => setActiveView('dashboard')}>
                    <div className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest group-hover:underline">{tier} Monitor</div>
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{user}</div>
                  </div>
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                  </button>
                  <button onClick={handleLogout} className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 min-w-0 relative z-10 ${isPro ? 'ml-20 md:ml-24' : ''}`}>
        <AnimatePresence mode="wait">
          {activeView === 'terminal' ? (
            <m.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-full overflow-x-hidden">
              <Hero tier={tier} onScrollTo={scrollToSection} />
              <div className="px-6 md:px-12 space-y-32 py-20 lg:py-32">
                <SampleGrid isAuthenticated={!!user} reports={reports} onAuthTrigger={() => setIsAuthModalOpen(true)} onSampleClick={setSelectedReport} isSimulated={isSimulated} />
                <AnalyticsSection tier={tier} reports={reports} onUpgradeTrigger={() => setIsAuthModalOpen(true)} />
                <Documentation />
                {!isPro && (
                  <PricingSection 
                    onSelectPlan={(plan) => {
                      if (plan === 'Pro Analyst') {
                        if (user) {
                          setIsTermsModalOpen(true);
                        } else {
                          setPendingUpgrade(true);
                          setIsAuthModalOpen(true);
                        }
                      }
                    }} 
                    userEmail={user}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            </m.div>
          ) : activeView === 'predictor' ? (
             <m.div key="predictor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <FiberPredictor user={user} tier={tier} onNotify={showNotification} />
             </m.div>
          ) : activeView === 'dashboard' ? (
             <m.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <UserDashboard loginCount={loginCount} timeSpentSeconds={totalTimeSeconds} lastLogin={lastLogin} />
             </m.div>
          ) : (
            <m.div key="lab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <LabPortal user={user} tier={tier} onNotify={showNotification} />
            </m.div>
          )}
        </AnimatePresence>
        <Footer onScrollTo={scrollToSection} onNotify={showNotification} />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingUpgrade(false);
        }} 
        onLogin={handleLogin}
        isUpgradeFlow={pendingUpgrade}
      />

      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={initiateProPayment}
      />

      <AnimatePresence>
        {selectedReport && (
          <SampleDetailModal sample={selectedReport} onClose={() => setSelectedReport(null)} tier={tier} onNotify={showNotification} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
