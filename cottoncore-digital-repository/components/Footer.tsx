
import React from 'react';
import { Beaker, Twitter, Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onScrollTo?: (id: string) => void;
  onNotify?: (msg: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onScrollTo, onNotify }) => {
  const socialLinks = [
    { Icon: Twitter, label: 'Twitter' },
    { Icon: Github, label: 'Github' },
    { Icon: Linkedin, label: 'LinkedIn' },
    { Icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onScrollTo?.('hero')}>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Beaker className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase text-slate-900 dark:text-white">CottonCore</span>
            </div>
            <p className="text-slate-500 dark:text-slate-500 max-w-md leading-relaxed mb-8 font-medium">
              A state-of-the-art digital infrastructure for cotton quality analysis, providing precision data for researchers, farmers, and textile engineers worldwide.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, label }, i) => (
                <button 
                  key={i} 
                  onClick={() => onNotify?.(`Redirecting to ${label}...`)}
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-200 mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li><button onClick={() => onScrollTo?.('repository')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Sample Repository</button></li>
              <li><button onClick={() => onScrollTo?.('analytics')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Analytics Dashboard</button></li>
              <li><button onClick={() => onScrollTo?.('pricing')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Plans & Pricing</button></li>
              <li><button onClick={() => onNotify?.('API documentation is in internal beta.')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">API Reference</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 dark:text-slate-200 mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li><button onClick={() => onScrollTo?.('docs')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Documentation</button></li>
              <li><button onClick={() => onNotify?.('Lab Protocols PDF initializing...')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Lab Protocols</button></li>
              <li><button onClick={() => onNotify?.('Accessing Academic journals...')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Research Papers</button></li>
              <li><button onClick={() => onNotify?.('Contact sequence initiated.')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-tight">Contact Support</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 dark:border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono font-bold tracking-widest">
            &copy; {new Date().getFullYear()} COTTONCORE ANALYTICS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            <button onClick={() => onNotify?.('Policy updated Oct 2024')}>Privacy Policy</button>
            <button onClick={() => onNotify?.('T&C last revised Nov 2024')}>Terms of Service</button>
            <button onClick={() => onNotify?.('Cookie preferences saved')}>Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
