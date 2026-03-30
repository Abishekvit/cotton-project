
import React from 'react';
import { Search, Database, LineChart, FlaskConical, Scan, Settings, LogOut, User, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  user: string | null;
  tier: string;
  onAuthClick: () => void;
  onLogout: () => void;
  activeView: 'terminal' | 'lab' | 'predictor' | 'dashboard';
  onViewChange: (view: 'terminal' | 'lab' | 'predictor' | 'dashboard') => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, tier, onAuthClick, onLogout, activeView, onViewChange }) => {
  const NavItem = ({ icon: Icon, id, label, proOnly = false }: { icon: any, id: 'terminal' | 'lab' | 'predictor' | 'dashboard', label: string, proOnly?: boolean }) => {
    const isLocked = proOnly && tier !== 'Pro';
    const isActive = activeView === id;

    return (
      <button 
        onClick={() => !isLocked && onViewChange(id)}
        className={`p-4 rounded-2xl transition-all group relative ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
            : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5'
        } ${isLocked ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        <Icon className="w-6 h-6" />
        {isLocked && <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />}
        <div className="absolute left-16 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-[0.2em] whitespace-nowrap z-50 shadow-xl">
          {label} {isLocked ? '(PRO ONLY)' : ''}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <NavItem icon={Search} id="terminal" label="Repository" />
      <NavItem icon={LayoutDashboard} id="dashboard" label="Activity Monitor" />
      <NavItem icon={Scan} id="predictor" label="Fiber Predictor" proOnly={true} />
      <NavItem icon={FlaskConical} id="lab" label="Lab Ingestion" proOnly={true} />
      
      {!user ? (
        <button 
          onClick={onAuthClick}
          className="p-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5"
        >
          <User className="w-6 h-6" />
        </button>
      ) : (
        <button 
          onClick={onLogout}
          className="p-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-500/5"
        >
          <LogOut className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Navigation;
