
import React from 'react';

interface IdleScreenProps {
  onStart: () => void;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col p-8 pt-32 overflow-hidden">
      {/* Power Header with QR */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="text-white text-[90px] leading-none font-black tracking-tighter">22</span>
            <span className="text-[#00e5ff] text-5xl font-black italic tracking-tighter">kW</span>
          </div>
          <div className="text-white/80 text-[10px] font-black uppercase tracking-[0.5em] mt-2">Maximum Available Power</div>
        </div>
        
        {/* Support/Info QR Code */}
        <div className="bg-white p-2 rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
          <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
               <path d="M3 3h4v4H3zM3 13h4v4H3zM13 3h4v4h-4zM13 13h4v4h-4zM3 10h1v1H3zM10 3h1v1h-1zM10 10h4v4h-4zM17 10h1v1h-1zM20 10h1v1h-1zM10 17h1v4h-1zM17 17h4v4h-4z" />
             </svg>
          </div>
          <div className="mt-1 text-[6px] text-black font-black uppercase text-center tracking-tighter">SCAN HELP</div>
        </div>
      </div>

      {/* Pricing Module - Optimized for visibility */}
      <div className="flex-1 space-y-3">
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-5 flex justify-between items-center transition-all hover:bg-white/10">
          <span className="text-white text-sm font-black uppercase tracking-[0.2em]">Energy</span>
          <span className="text-white text-2xl font-black tracking-tighter">€0.55 <span className="text-[10px] text-white/50 font-bold uppercase ml-1">/ kWh</span></span>
        </div>
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-5 flex justify-between items-center transition-all hover:bg-white/10">
          <span className="text-white text-sm font-black uppercase tracking-[0.2em]">Initial</span>
          <span className="text-white text-2xl font-black tracking-tighter">€1.00 <span className="text-[10px] text-white/50 font-bold uppercase ml-1">FLAT</span></span>
        </div>
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-5 flex justify-between items-center transition-all hover:bg-white/10">
          <div className="flex flex-col">
            <span className="text-white text-sm font-black uppercase tracking-[0.2em]">Idle Fee</span>
            <span className="text-[8px] text-[#00e5ff] font-black uppercase tracking-[0.3em] mt-1 italic">POST-SESSION</span>
          </div>
          <span className="text-white text-2xl font-black tracking-tighter">€0.30 <span className="text-[10px] text-white/50 font-bold uppercase ml-1">/ MIN</span></span>
        </div>
      </div>
    </div>
  );
};

export default IdleScreen;
