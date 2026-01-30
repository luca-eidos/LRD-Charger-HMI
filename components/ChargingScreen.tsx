
import React from 'react';
import { ChargingData } from '../types';

interface ChargingScreenProps {
  data: ChargingData;
  isConnecting: boolean;
  onStop: () => void;
}

const ChargingScreen: React.FC<ChargingScreenProps> = ({ data, isConnecting, onStop }) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col p-12 pt-32 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Active Power Gauge - Maximized Visibility, Fix clipping with larger container and proper padding */}
      <div className="flex justify-center mb-16 relative">
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Progress Ring with Aggressive Glow - Use larger SVG viewBox to prevent clipping */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 320 320">
            {/* Background Track */}
            <circle cx="160" cy="160" r="110" className="stroke-white/10 fill-none" strokeWidth="24" />
            {/* High Contrast Static Full Arc */}
            <circle 
              cx="160" cy="160" r="110" 
              className="stroke-[#00e5ff] fill-none" 
              strokeWidth="28" 
              strokeDasharray="691"
              strokeDashoffset="0"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 25px rgba(0,229,255,0.9))' }}
            />
          </svg>
          
          {/* Central Data Display */}
          <div className="text-center z-10">
            <div className="text-[#00e5ff] text-[11px] font-black uppercase tracking-[0.6em] mb-1 opacity-80">LIVE FLOW</div>
            <div className="text-white text-[95px] font-black leading-none tracking-tighter drop-shadow-2xl tabular-nums">{Math.round(data.currentPower)}</div>
            <div className="text-[#00e5ff] text-2xl font-black italic tracking-tighter uppercase">kW</div>
          </div>
        </div>
      </div>

      {/* Spacer to push metrics to bottom */}
      <div className="flex-1"></div>

      {/* Real-time Metric Cards - Positioned at the bottom */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <MetricBlock 
          label="Energy Transferred" 
          value={data.energyDelivered.toFixed(2)} 
          unit="kWh" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
        />
        <MetricBlock 
          label="Elapsed Session" 
          value={formatTime(data.elapsedTime)} 
          unit="H:M:S" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
      </div>
    </div>
  );
};

const MetricBlock: React.FC<{ label: string, value: string, unit: string, icon: React.ReactNode }> = ({ label, value, unit, icon }) => (
  <div className="bg-white/5 border-[3px] border-white/10 rounded-[30px] p-8 flex flex-col justify-center transition-all hover:bg-white/[0.08] relative">
    <div className="flex items-center gap-4 mb-3">
      <div className="text-[#00e5ff] scale-100">{icon}</div>
      <div className="text-white/70 text-[11px] font-black uppercase tracking-[0.3em]">{label}</div>
    </div>
    <div className="flex items-baseline gap-2.5">
      <span className="text-5xl font-black tracking-tighter text-white tabular-nums">{value}</span>
      <span className="text-[#00e5ff] text-[12px] font-black uppercase opacity-70 ml-1">{unit}</span>
    </div>
    <div className="absolute top-4 right-8 w-1 h-10 bg-white/5 rounded-full"></div>
  </div>
);

export default ChargingScreen;
