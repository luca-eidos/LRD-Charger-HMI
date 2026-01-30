
import React from 'react';

interface IdleScreenProps {
  onStart: () => void;
  isLightTheme?: boolean;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ onStart, isLightTheme = false }) => {
  const textPrimary = isLightTheme ? 'text-slate-900' : 'text-white';
  const textSecondary = isLightTheme ? 'text-slate-400' : 'text-white/80';
  const blockClasses = isLightTheme 
    ? 'bg-slate-50 border-slate-200 shadow-sm hover:bg-slate-100' 
    : 'bg-white/5 border-white/10 hover:bg-white/10';

  return (
    <div className="flex-1 flex flex-col p-8 pt-32 overflow-hidden">
      {/* Power Header with QR */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-4">
            <span className={`text-[110px] leading-none font-black tracking-tighter transition-colors ${textPrimary}`}>22</span>
            <span className="text-[#00e5ff] text-6xl font-black italic tracking-tighter">kW</span>
          </div>
          <div className={`text-xs font-black uppercase tracking-[0.5em] mt-3 transition-colors ${textSecondary}`}>Maximum Available Power</div>
        </div>
        
        {/* Support/Info QR Code */}
        <div className={`p-3 rounded-2xl shadow-lg transition-colors ${isLightTheme ? 'bg-slate-900' : 'bg-white'}`}>
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${isLightTheme ? 'bg-slate-800' : 'bg-black'}`}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
               <path d="M3 3h4v4H3zM3 13h4v4H3zM13 3h4v4h-4zM13 13h4v4h-4zM3 10h1v1H3zM10 3h1v1h-1zM10 10h4v4h-4zM17 10h1v1h-1zM20 10h1v1h-1zM10 17h1v4h-1zM17 17h4v4h-4z" />
             </svg>
          </div>
          <div className={`mt-2 text-[8px] font-black uppercase text-center tracking-tighter ${isLightTheme ? 'text-white' : 'text-black'}`}>SCAN HELP</div>
        </div>
      </div>

      {/* Pricing Module - Optimized for high visibility */}
      <div className="flex-1 space-y-4">
        <div className={`border-2 rounded-2xl p-6 flex justify-between items-center transition-all ${blockClasses}`}>
          <span className={`text-lg font-black uppercase tracking-[0.2em] transition-colors ${textPrimary}`}>Energy</span>
          <span className={`text-4xl font-black tracking-tighter transition-colors ${textPrimary}`}>€0.55 <span className={`text-sm font-bold uppercase ml-1 ${textSecondary}`}>/ kWh</span></span>
        </div>
        <div className={`border-2 rounded-2xl p-6 flex justify-between items-center transition-all ${blockClasses}`}>
          <span className={`text-lg font-black uppercase tracking-[0.2em] transition-colors ${textPrimary}`}>Initial</span>
          <span className={`text-4xl font-black tracking-tighter transition-colors ${textPrimary}`}>€1.00 <span className={`text-sm font-bold uppercase ml-1 ${textSecondary}`}>FLAT</span></span>
        </div>
        <div className={`border-2 rounded-2xl p-6 flex justify-between items-center transition-all ${blockClasses}`}>
          <div className="flex flex-col">
            <span className={`text-lg font-black uppercase tracking-[0.2em] transition-colors ${textPrimary}`}>Idle Fee</span>
            <span className="text-[10px] text-[#00e5ff] font-black uppercase tracking-[0.3em] mt-1 italic">POST-SESSION</span>
          </div>
          <span className={`text-4xl font-black tracking-tighter transition-colors ${textPrimary}`}>€0.30 <span className={`text-sm font-bold uppercase ml-1 ${textSecondary}`}>/ MIN</span></span>
        </div>
      </div>
    </div>
  );
};

export default IdleScreen;
