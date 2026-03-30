
import React from 'react';
import { Check, ShieldCheck, Zap, Globe } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: 'Academic',
      price: 'Free',
      description: 'For students and individual researchers.',
      features: ['Basic HVI Metrics', '100 Sample Lookups/mo', 'Public Community Support', 'Standard Exports'],
      icon: Globe,
      cta: 'Current Plan',
      highlight: false,
    },
    {
      name: 'Pro Analyst',
      price: '$49',
      period: '/mo',
      description: 'Full access for laboratory professionals.',
      features: ['Unlimited HVI Metrics', 'Radar Variety Profiles', 'Batch CSV Exports', 'Priority Lab Support', 'Trend Visualization'],
      icon: Zap,
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated infrastructure for large mills.',
      features: ['White-label Portal', 'On-premise Database', 'Custom API Integration', '24/7 Dedicated Support', 'SLA Guarantee'],
      icon: ShieldCheck,
      cta: 'Contact Sales',
      highlight: false,
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 tracking-tight">SELECT YOUR TIER</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Choose the precision level required for your cotton fiber analysis workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:translate-y-[-8px] ${
                plan.highlight 
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' 
                  : 'bg-slate-900/50 border-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Recommended
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => plan.cta !== 'Current Plan' && onSelectPlan(plan.name)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-blue-500 text-white hover:bg-blue-400' 
                    : plan.cta === 'Current Plan'
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-white text-black hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
