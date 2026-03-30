
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  // Cast motion to any to avoid property errors on shorthand elements
  const m = motion as any;

  return (
    <button
      onClick={onToggle}
      className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-90"
      aria-label="Toggle theme"
    >
      <m.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </m.div>
    </button>
  );
};

export default ThemeToggle;
