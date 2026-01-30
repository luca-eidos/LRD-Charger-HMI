
import React from 'react';
import { ChargingData } from '../types';

interface ChargingScreenProps {
  data: ChargingData;
  isConnecting: boolean;
  onStop: () => void;
  isLightTheme?: boolean;
}

const ChargingScreen: React.FC<ChargingScreenProps> = ({ data, isConnecting, onStop, isLightTheme = false }) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const textPrimary = isLightTheme ? 'text-slate-900' : 'text-white';
  const textSecondary = isLightTheme ? 'text-slate-400' : 'text-white/70';

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 animate-in fade-in duration-500 overflow-visible">
      
      {/* Active Power Gauge */}
      <div className="flex justify-center mb-4 relative">
        <div className="relative w-72 h-[218px] overflow-hidden">
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 320 320">
              <circle cx="160" cy="160" r="132" className={`fill-none stroke-current transition-colors duration-500 ${isLightTheme ? 'text-slate-100' : 'text-white/10'}`} strokeWidth="24" />
              <circle 
                cx="160" cy="160" r="132" 
                className="stroke-[#00e5ff] fill-none transition-all duration-700" 
                strokeWidth="28" 
                strokeDasharray="829.38"
                strokeDashoffset="0"
                strokeLinecap="round"
                style={{ filter: isLightTheme ? 'none' : 'drop-shadow(0 0 12px rgba(0,229,255,0.7))' }}
              />
            </svg>
            
            <div className="text-center z-10">
              <div className="text-[#00e5ff] text-[10px] font-black uppercase tracking-[0.6em] mb-1 opacity-80">LIVE FLOW</div>
              <div className={`text-[80px] font-black leading-none tracking-tighter drop-shadow-2xl tabular-nums transition-colors ${textPrimary}`}>{Math.round(data.currentPower)}</div>
              <div className="text-[#00e5ff] text-xl font-black italic tracking-tighter uppercase">kW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Blocks - Moved Up */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <MetricBlock 
          label="Energy Transferred" 
          value={data.energyDelivered.toFixed(2)} 
          unit="kWh" 
          isLightTheme={isLightTheme}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
        />
        <MetricBlock 
          label="Elapsed Session" 
          value={formatTime(data.elapsedTime)} 
          unit="H:M:S" 
          isLightTheme={isLightTheme}
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

const MetricBlock: React.FC<{ label: string, value: string, unit: string, icon: React.ReactNode, isLightTheme: boolean }> = ({ label, value, unit, icon, isLightTheme }) => (
  <div className={`border-[3px] rounded-[30px] p-6 flex flex-col justify-center transition-all relative ${isLightTheme ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
    <div className="flex items-center gap-4 mb-3">
      <div className="text-[#00e5ff] scale-100">{icon}</div>
      <div className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors ${isLightTheme ? 'text-slate-400' : 'text-white/70'}`}>{label}</div>
    </div>
    <div className="flex items-baseline gap-2.5">
      <span className={`text-3xl font-black tracking-tighter transition-colors tabular-nums ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>{value}</span>
      <span className="text-[#00e5ff] text-[12px] font-black uppercase opacity-70 ml-1">{unit}</span>
    </div>
  </div>
);

export default ChargingScreen;
