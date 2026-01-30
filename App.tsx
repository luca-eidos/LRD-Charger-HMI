
import React, { useState, useEffect } from 'react';
import { HMIState, ChargingData } from './types';
import IdleScreen from './components/IdleScreen';
import ChargingScreen from './components/ChargingScreen';
import ImageGenOverlay from './components/ImageGenOverlay';

const App: React.FC = () => {
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [showImageGen, setShowImageGen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: dd/mm/yyyy
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      setCurrentDate(`${d}/${m}/${y}`);

      // Format: HH:mm:ss
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}:${ss}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Connector 1 State
  const [state1, setState1] = useState<HMIState>('IDLE');
  const [data1, setData1] = useState<ChargingData>({
    energyDelivered: 0, currentPower: 22.0, soc: 18, cost: 0, elapsedTime: 0
  });

  // Connector 2 State
  const [state2, setState2] = useState<HMIState>('IDLE');
  const [data2, setData2] = useState<ChargingData>({
    energyDelivered: 0, currentPower: 11.0, soc: 42, cost: 0, elapsedTime: 0
  });

  // Independent simulation for both connectors
  useEffect(() => {
    const interval = setInterval(() => {
      if (state1 === 'CHARGING') {
        setData1(prev => ({
          ...prev,
          energyDelivered: prev.energyDelivered + 0.006,
          cost: prev.cost + 0.004,
          elapsedTime: prev.elapsedTime + 1,
          soc: Math.min(prev.soc + 0.02, 100)
        }));
      }
      if (state2 === 'CHARGING') {
        setData2(prev => ({
          ...prev,
          energyDelivered: prev.energyDelivered + 0.003,
          cost: prev.cost + 0.002,
          elapsedTime: prev.elapsedTime + 1,
          soc: Math.min(prev.soc + 0.01, 100)
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state1, state2]);

  const handleStartProcess = (socketId: 1 | 2) => {
    const setSideState = socketId === 1 ? setState1 : setState2;
    setSideState('AUTHORIZING');
    setTimeout(() => {
      const isSuccess = Math.random() > 0.05;
      if (isSuccess) {
        setSideState('AUTHORIZED_SUCCESS');
        setTimeout(() => setSideState('CHARGING'), 2500);
      } else {
        setSideState('AUTHORIZATION_DENIED');
      }
    }, 2000);
  };

  const handleStop = (socketId: 1 | 2) => {
    const setSideState = socketId === 1 ? setState1 : setState2;
    setSideState('SUMMARY');
  };

  const handleFinish = (socketId: 1 | 2) => {
    const setSideState = socketId === 1 ? setState1 : setState2;
    const setSideData = socketId === 1 ? setData1 : setData2;
    const defaultData = socketId === 1 
      ? { energyDelivered: 0, currentPower: 22.0, soc: 18, cost: 0, elapsedTime: 0 }
      : { energyDelivered: 0, currentPower: 11.0, soc: 42, cost: 0, elapsedTime: 0 };
    setSideState('IDLE');
    setSideData(defaultData);
  };

  const getButtonLabel = (state: HMIState) => {
    switch(state) {
      case 'IDLE': return 'START';
      case 'AUTHORIZING': return 'WAIT';
      case 'AUTHORIZED_SUCCESS': return 'PLUG IN';
      case 'AUTHORIZATION_DENIED': return 'RETRY';
      case 'CHARGING': return 'STOP';
      case 'SUMMARY': return 'FINISH';
      default: return 'START';
    }
  };

  const formatSummaryTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6">
      <div className="flex flex-col items-center gap-10 w-full max-w-[1300px]">
        
        {/* The 16:9 Screen Container - Expanded Frame */}
        <div className="relative w-full aspect-video bg-[#0d0f11] overflow-hidden rounded-[60px] border-[24px] border-[#1e2022] shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col">
          {customBg && (
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000"
              style={{ backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}

          {/* HMI Header */}
          <div className="z-20 px-16 py-8 flex justify-between items-center bg-[#0d0f11]/95 backdrop-blur-xl border-b border-white/10 text-white/70 text-xs font-black uppercase tracking-[0.4em]">
            <div className="flex items-center gap-8">
              <span className="text-[#00e5ff] text-2xl tracking-tighter italic font-bold">PowerNode DUO</span>
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              <span className="opacity-90 font-black text-[15px]">{currentDate}</span>
            </div>
            <div className="flex items-center gap-10">
              <div className="flex items-baseline gap-3">
                <span className="text-white font-black text-3xl tracking-tighter tabular-nums">{currentTime}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex z-10 relative">
            <div className="flex-1 flex flex-col border-r border-white/10 relative overflow-hidden">
              <SocketLabel label="1" status={state1} />
              <SocketContent 
                state={state1} 
                data={data1} 
                onFinish={() => handleFinish(1)}
              />
            </div>
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <SocketLabel label="2" status={state2} />
              <SocketContent 
                state={state2} 
                data={data2} 
                onFinish={() => handleFinish(2)}
              />
            </div>
          </div>

          {showImageGen && <ImageGenOverlay onClose={() => setShowImageGen(false)} onImageGenerated={(url) => { setCustomBg(url); setShowImageGen(false); }} />}
        </div>

        {/* Physical Controls & Global Settings */}
        <div className="w-full flex flex-col gap-10">
          <div className="flex justify-between w-full px-16 gap-20">
            {/* Controls for Socket 1 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-white/30 text-[12px] font-black uppercase tracking-[0.5em] mb-5">Socket 1 Command</div>
              <button 
                onClick={() => {
                  if (state1 === 'IDLE' || state1 === 'AUTHORIZATION_DENIED') handleStartProcess(1);
                  else if (state1 === 'CHARGING') handleStop(1);
                  else if (state1 === 'SUMMARY') handleFinish(1);
                }}
                disabled={state1 === 'AUTHORIZING' || state1 === 'AUTHORIZED_SUCCESS'}
                className={`w-full py-12 rounded-[50px] border-[6px] flex items-center justify-center gap-8 transition-all active:scale-95 disabled:opacity-40
                  ${state1 === 'CHARGING' 
                    ? 'bg-red-600/10 border-red-500 shadow-[0_20px_70px_rgba(239,68,68,0.5)]' 
                    : 'bg-[#00e5ff]/10 border-[#00e5ff] shadow-[0_20px_70px_rgba(0,229,255,0.5)]'}`}
              >
                <div className={`w-5 h-5 rounded-full ${state1 === 'CHARGING' ? 'bg-red-500 animate-pulse' : 'bg-[#00e5ff]'}`}></div>
                <span className={`text-5xl font-black uppercase tracking-[0.2em] ${state1 === 'CHARGING' ? 'text-red-400' : 'text-[#00e5ff]'}`}>
                  {getButtonLabel(state1)}
                </span>
              </button>
            </div>

            {/* Controls for Socket 2 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-white/30 text-[12px] font-black uppercase tracking-[0.5em] mb-5">Socket 2 Command</div>
              <button 
                onClick={() => {
                  if (state2 === 'IDLE' || state2 === 'AUTHORIZATION_DENIED') handleStartProcess(2);
                  else if (state2 === 'CHARGING') handleStop(2);
                  else if (state2 === 'SUMMARY') handleFinish(2);
                }}
                disabled={state2 === 'AUTHORIZING' || state2 === 'AUTHORIZED_SUCCESS'}
                className={`w-full py-12 rounded-[50px] border-[6px] flex items-center justify-center gap-8 transition-all active:scale-95 disabled:opacity-40
                  ${state2 === 'CHARGING' 
                    ? 'bg-red-600/10 border-red-500 shadow-[0_20px_70px_rgba(239,68,68,0.5)]' 
                    : 'bg-[#00e5ff]/10 border-[#00e5ff] shadow-[0_20px_70px_rgba(0,229,255,0.5)]'}`}
              >
                <div className={`w-5 h-5 rounded-full ${state2 === 'CHARGING' ? 'bg-red-500 animate-pulse' : 'bg-[#00e5ff]'}`}></div>
                <span className={`text-5xl font-black uppercase tracking-[0.2em] ${state2 === 'CHARGING' ? 'text-red-400' : 'text-[#00e5ff]'}`}>
                  {getButtonLabel(state2)}
                </span>
              </button>
            </div>
          </div>

          {/* Theme Settings Button - Outside Frame */}
          <div className="flex justify-center">
            <button 
              onClick={() => setShowImageGen(true)} 
              className="px-14 py-5 bg-white/5 hover:bg-white/10 border-[3px] border-white/20 rounded-full text-white/60 hover:text-[#00e5ff] transition-all font-black text-base uppercase tracking-[0.4em] active:scale-95"
            >
              HMI Theme Customization
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocketLabel: React.FC<{ label: string, status: string }> = ({ label, status }) => (
  <div className="absolute top-10 left-12 flex items-center gap-6 z-30 pointer-events-none">
    <div className="bg-[#00e5ff] text-black px-8 py-3 rounded-2xl font-black text-4xl shadow-[0_8px_25px_rgba(0,229,255,0.6)]">
      {label}
    </div>
    <div className={`text-base font-black uppercase tracking-[0.4em] px-5 py-2.5 rounded-2xl border-[3px] ${
      status === 'IDLE' 
        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
        : status === 'AUTHORIZATION_DENIED'
        ? 'bg-red-500/10 border-red-500/30 text-red-400'
        : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
    }`}>
      {status.replace('_', ' ')}
    </div>
  </div>
);

const SocketContent: React.FC<{ 
  state: HMIState, 
  data: ChargingData, 
  onFinish: () => void
}> = ({ state, data, onFinish }) => {
  const formatSummaryTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  switch (state) {
    case 'IDLE':
      return <IdleScreen onStart={() => {}} />;
    case 'AUTHORIZING':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-14 animate-in fade-in duration-500">
          <div className="w-40 h-40 rounded-full border-[12px] border-[#00e5ff]/20 border-t-[#00e5ff] animate-spin mb-14 shadow-[0_0_80px_rgba(0,229,255,0.5)]"></div>
          <h2 className="text-white text-5xl font-black uppercase tracking-[0.3em] mb-6">Authorizing...</h2>
          <p className="text-white/70 text-2xl font-black uppercase tracking-widest text-center leading-relaxed">Processing<br/>Encrypted Payment</p>
        </div>
      );
    case 'AUTHORIZED_SUCCESS':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-14 text-center animate-in zoom-in duration-500">
          <div className="w-36 h-36 rounded-full bg-green-500/20 flex items-center justify-center mb-10 border-[5px] border-green-500/40">
            <svg className="text-green-400" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-white text-4xl font-black uppercase tracking-tighter mb-6 italic leading-tight">Access<br/>Granted</h2>
          <p className="text-[#00e5ff] text-2xl font-black uppercase tracking-widest leading-relaxed">
            Please connect cable<br/>to your vehicle
          </p>
        </div>
      );
    case 'AUTHORIZATION_DENIED':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-14 text-center animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-44 h-44 rounded-full bg-red-500/20 flex items-center justify-center mb-14 border-[6px] border-red-500/40">
            <svg className="text-red-400" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h2 className="text-red-400 text-6xl font-black uppercase tracking-tighter mb-8 italic">Denied</h2>
          <p className="text-white text-2xl font-black uppercase tracking-widest mb-12">Validation Error.</p>
          <p className="text-white/40 text-[12px] font-black uppercase tracking-[0.5em] bg-white/5 px-8 py-3 rounded-full">Use command button to retry</p>
        </div>
      );
    case 'CHARGING':
      return <ChargingScreen data={data} isConnecting={false} onStop={() => {}} />;
    case 'SUMMARY':
      return (
        <div className="flex-1 flex flex-col p-16 pt-40 animate-in fade-in duration-700">
          <div className="mb-14 flex justify-between items-end">
            <h2 className="text-white text-7xl font-black uppercase italic tracking-tighter">Summary</h2>
            <span className="text-white/40 text-[14px] font-black uppercase tracking-widest mb-1 opacity-60">SESS #992-VP</span>
          </div>
          
          <div className="bg-white/5 border-[4px] border-white/20 rounded-[50px] p-12 mb-14 shadow-2xl">
            <div className="space-y-10">
              <div className="flex justify-between items-baseline border-b-2 border-white/10 pb-8">
                <span className="text-white/80 text-3xl font-black uppercase tracking-widest">Total Cost</span>
                <span className="text-[#00e5ff] text-8xl font-black tracking-tighter">€{data.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <div className="flex flex-col gap-3">
                  <span className="text-[14px] text-white/50 font-black uppercase tracking-[0.4em]">Session Time</span>
                  <span className="text-4xl font-black tracking-tight">{formatSummaryTime(data.elapsedTime)}</span>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <span className="text-[14px] text-white/50 font-black uppercase tracking-[0.4em]">Tariff</span>
                  <span className="text-4xl font-black text-[#00e5ff]">ULTRA DC</span>
                </div>
              </div>
            </div>
          </div>
           <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12 bg-white/5 border-[4px] border-white/10 rounded-[50px]">
            <div className="w-28 h-28 bg-white p-4 rounded-3xl shadow-2xl">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="black">
                <path d="M3 3h4v4H3zM3 10h1v1H3zM3 13h4v4H3zM5 5h0M5 15h0M10 3h1v1h-1zM10 10h4v4h-4zM10 17h1v4h-1zM13 3h4v4h-4zM13 17h4v4h-4zM17 10h1v1h-1zM17 13h1v1h-1zM20 3h1v4h-1zM20 10h1v1h-1zM20 13h1v8h-1zM5 5h1M11 11h2v2h-2zM14 4h2M4 14h2M14 18h2M18 4h2" />
              </svg>
            </div>
            <div className="text-center">
              <span className="text-white text-lg font-black uppercase tracking-[0.5em]">Scan for receipt</span>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default App;
