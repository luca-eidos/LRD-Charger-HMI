
import React, { useState, useEffect } from 'react';
import { HMIState, ChargingData } from './types';
import IdleScreen from './components/IdleScreen';
import ChargingScreen from './components/ChargingScreen';
import ImageGenOverlay from './components/ImageGenOverlay';

const App: React.FC = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [showImageGen, setShowImageGen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Connectivity States
  const [isOnline, setIsOnline] = useState(true);
  const [connType, setConnType] = useState<'LTE' | 'ETHERNET'>('LTE');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      setCurrentDate(`${d}/${m}/${y}`);

      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hh}:${mm}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [state1, setState1] = useState<HMIState>('IDLE');
  const [data1, setData1] = useState<ChargingData>({
    energyDelivered: 0, currentPower: 22.0, soc: 18, cost: 0, elapsedTime: 0
  });

  const [state2, setState2] = useState<HMIState>('IDLE');
  const [data2, setData2] = useState<ChargingData>({
    energyDelivered: 0, currentPower: 11.0, soc: 42, cost: 0, elapsedTime: 0
  });

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

  const handleStartProcess = (socketId: 1 | 2, forceSuccess: boolean) => {
    const setSideState = socketId === 1 ? setState1 : setState2;
    setSideState('AUTHORIZING');
    setTimeout(() => {
      if (forceSuccess) {
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

  const triggerError = (socketId: 1 | 2) => {
    const setSideState = socketId === 1 ? setState1 : setState2;
    setSideState('ERROR');
  };

  const getButtonLabel = (state: HMIState) => {
    switch (state) {
      case 'IDLE': return 'START';
      case 'AUTHORIZING': return 'WAIT';
      case 'AUTHORIZED_SUCCESS': return 'PLUG';
      case 'AUTHORIZATION_DENIED': return 'RETRY';
      case 'CHARGING': return 'STOP';
      case 'SUMMARY': return 'DONE';
      case 'ERROR': return 'RESET';
      default: return 'START';
    }
  };

  const themeClasses = isLightTheme
    ? {
      appBg: 'bg-[#f1f5f9]',
      frameBg: 'bg-white',
      frameBorder: 'border-slate-200',
      headerBg: 'bg-white/90 border-slate-200',
      divider: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      buttonActionBg: 'bg-[#00e5ff]/5 border-[#00e5ff]',
      buttonMutedBg: 'bg-slate-100 border-slate-200'
    }
    : {
      appBg: 'bg-[#050505]',
      frameBg: 'bg-[#0d0f11]',
      frameBorder: 'border-[#1e2022]',
      headerBg: 'bg-[#0d0f11]/95 border-white/10',
      divider: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-white/70',
      buttonActionBg: 'bg-[#00e5ff]/10 border-[#00e5ff]',
      buttonMutedBg: 'bg-white/5 border-white/20'
    };

  return (
    <div className={`relative flex items-center justify-center min-h-screen p-6 transition-colors duration-500 ${themeClasses.appBg}`}>
      <div className="flex flex-col items-center gap-10 w-full max-w-[1024px]">
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsLightTheme(!isLightTheme)}
            className={`flex items-center justify-center p-2 rounded-lg border transition-all active:scale-90 ${isLightTheme ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/60'}`}
            title="Toggle Theme"
          >
            {isLightTheme ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707m12.728 0-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
        </div>

        <div className={`relative w-full aspect-video overflow-hidden rounded-[2px] border-[2px] shadow-[0_0_150px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500 ${themeClasses.frameBg} ${themeClasses.frameBorder}`}>
          {customBg && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000"
              style={{ backgroundImage: `url(${customBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}

          {/* Header */}
          <div className={`z-20 px-8 py-4 flex justify-between items-center backdrop-blur-xl border-b text-xs font-black uppercase tracking-[0.4em] transition-all duration-500 ${themeClasses.headerBg} ${isLightTheme ? 'text-slate-500' : 'text-white/70'}`}>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[#00e5ff] text-2xl tracking-tighter italic font-bold leading-tight">PowerNode DUO</span>
                <div
                  className="flex items-center gap-2 mt-1 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => setIsOnline(!isOnline)}
                >
                  <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${isOnline ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500'}`}></div>
                  <span className={`text-[9px] font-black tracking-widest ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border cursor-pointer hover:bg-opacity-20 active:scale-95 transition-all ${isLightTheme ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}
                onClick={() => setConnType(connType === 'LTE' ? 'ETHERNET' : 'LTE')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#00e5ff]">
                  {connType === 'LTE' ? (
                    <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>
                  ) : (
                    <><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 14V2" /><path d="M10 14V2" /><path d="M14 14V2" /><path d="M18 14V2" /></>
                  )}
                </svg>
                <span className={`text-[10px] font-black tracking-[0.2em] ${isLightTheme ? 'text-slate-400' : 'text-white/40'}`}>{connType}</span>
              </div>

              <div className="flex items-center gap-6">
                <span className={`opacity-90 font-black text-[15px] transition-colors ${themeClasses.textPrimary}`}>{currentDate}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${isLightTheme ? 'bg-slate-300' : 'bg-white/20'}`}></div>
                <div className="flex items-baseline gap-3">
                  <span className={`font-black text-3xl tracking-tighter tabular-nums transition-colors ${themeClasses.textPrimary}`}>{currentTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex z-10 relative">
            <div className={`flex-1 flex flex-col border-r relative overflow-hidden ${themeClasses.divider}`}>
              <SocketLabel label="1" status={state1} theme={isLightTheme} />
              <SocketContent
                state={state1}
                data={data1}
                isLightTheme={isLightTheme}
              />
            </div>
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <SocketLabel label="2" status={state2} theme={isLightTheme} />
              <SocketContent
                state={state2}
                data={data2}
                isLightTheme={isLightTheme}
              />
            </div>
          </div>

          {showImageGen && <ImageGenOverlay onClose={() => setShowImageGen(false)} onImageGenerated={(url) => { setCustomBg(url); setShowImageGen(false); }} isLightTheme={isLightTheme} />}
        </div>

        {/* Socket Controls - Commands Area */}
        <div className="w-full flex flex-col gap-10">
          <div className="flex justify-between w-full px-16 gap-20">
            {[1, 2].map((id) => {
              const s = id === 1 ? state1 : state2;
              const isIdleOrDenied = s === 'IDLE' || s === 'AUTHORIZATION_DENIED';
              const isError = s === 'ERROR';

              return (
                <div key={id} className="flex-1 flex flex-col items-center">
                  <div className={`text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-center transition-colors ${isLightTheme ? 'text-slate-400' : 'text-white/30'}`}>Socket {id} Controls</div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col gap-4">
                      {isIdleOrDenied || isError ? (
                        <div className="flex flex-col gap-2 h-full">
                          <button
                            onClick={() => {
                              if (isError) handleFinish(id as 1 | 2);
                              else handleStartProcess(id as 1 | 2, true);
                            }}
                            className={`flex-1 rounded-[32px] border-[4px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95
                              ${themeClasses.buttonActionBg} shadow-[0_8px_25px_rgba(0,229,255,0.2)]`}
                          >
                            <span className="text-xl font-black uppercase tracking-[0.1em] text-[#00e5ff]">
                              {isError ? 'RESET' : 'AUTH OK'}
                            </span>
                          </button>
                          {!isError && (
                            <button
                              onClick={() => handleStartProcess(id as 1 | 2, false)}
                              className={`flex-1 rounded-[32px] border-[4px] flex flex-col items-center justify-center gap-1 transition-all active:scale-95
                                bg-red-600/5 border-red-500/30`}
                            >
                              <span className="text-xl font-black uppercase tracking-[0.1em] text-red-500">
                                AUTH FAIL
                              </span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (s === 'CHARGING') handleStop(id as 1 | 2);
                            else if (s === 'SUMMARY') handleFinish(id as 1 | 2);
                          }}
                          disabled={s === 'AUTHORIZING' || s === 'AUTHORIZED_SUCCESS'}
                          className={`w-full h-full py-8 rounded-[32px] border-[4px] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-40
                            ${s === 'CHARGING'
                              ? 'bg-red-600/10 border-red-500 shadow-[0_8px_25px_rgba(239,68,68,0.2)]'
                              : themeClasses.buttonActionBg + ' shadow-[0_8px_25px_rgba(0,229,255,0.2)]'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full ${s === 'CHARGING' ? 'bg-red-500 animate-pulse' : 'bg-[#00e5ff]'}`}></div>
                          <span className={`text-2xl font-black uppercase tracking-[0.2em] ${s === 'CHARGING' ? 'text-red-400' : 'text-[#00e5ff]'}`}>
                            {getButtonLabel(s)}
                          </span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => triggerError(id as 1 | 2)}
                      className={`py-8 rounded-[32px] border-[4px] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${isLightTheme ? 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-400' : 'border-red-600/30 bg-red-600/5 hover:bg-red-600/10 hover:border-red-600/60'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" className="mb-0.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span className="text-red-500 text-2xl font-black uppercase tracking-[0.2em]">FAULT</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

const SocketLabel: React.FC<{ label: string, status: string, theme: boolean }> = ({ label, status, theme }) => (
  <div className="absolute top-4 left-5 flex items-center gap-6 z-30 pointer-events-none">
    <div className="bg-[#00e5ff] text-black px-8 py-3 rounded-2xl font-black text-xl shadow-[0_4px_12px_rgba(0,229,255,0.3)]">
      {label}
    </div>
    <div className={`text-base font-black uppercase tracking-[0.4em] px-5 py-2.5 rounded-2xl border-[3px] transition-all duration-500 ${status === 'IDLE'
      ? 'bg-green-500/10 border-green-500/30 text-green-500'
      : status === 'ERROR' || status === 'AUTHORIZATION_DENIED'
        ? 'bg-red-500/10 border-red-500/30 text-red-500'
        : 'bg-orange-500/10 border-orange-500/30 text-orange-500'
      }`}>
      {status.replace('_', ' ')}
    </div>
  </div>
);

const SocketContent: React.FC<{
  state: HMIState,
  data: ChargingData,
  isLightTheme: boolean
}> = ({ state, data, isLightTheme }) => {
  const formatSummaryTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const textPrimary = isLightTheme ? 'text-slate-900' : 'text-white';
  const textSecondary = isLightTheme ? 'text-slate-500' : 'text-white/70';

  switch (state) {
    case 'IDLE':
      return <IdleScreen isLightTheme={isLightTheme} onStart={() => { }} />;
    case 'AUTHORIZING':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-5000">
          <div className="w-32 h-32 rounded-full border-[10px] border-[#00e5ff]/20 border-t-[#00e5ff] animate-spin mb-5 shadow-[0_0_40px_rgba(0,229,255,0.25)]"></div>
          <h2 className={`text-lg font-black uppercase tracking-[0.3em] mb-3 transition-colors ${textPrimary}`}>Validating...</h2>
          <p className={`text-lg font-black uppercase tracking-widest text-center leading-relaxed transition-colors ${textSecondary}`}>Checking<br />RFID Credentials</p>
        </div>
      );
    case 'AUTHORIZED_SUCCESS':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in duration-500">
          <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center mb-5 border-[4px] border-green-500/40">
            <svg className="text-green-500" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className={`text-lg font-black uppercase tracking-tighter mb-3 italic leading-tight transition-colors ${textPrimary}`}>Access<br />Granted</h2>
          <p className="text-[#00e5ff] text-lg font-black uppercase tracking-widest leading-relaxed">
            Please connect cable<br />to your vehicle
          </p>
        </div>
      );
    case 'AUTHORIZATION_DENIED':
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center mb-5 border-[4px] border-red-500/40">
            <svg className="text-red-500" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
          <h2 className="text-red-500 text-4xl font-black uppercase tracking-tighter mb-3 italic">Denied</h2>
          <p className={`text-lg font-black uppercase tracking-widest mb-4 transition-colors ${textPrimary}`}>Invalid Card.</p>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-full italic ${isLightTheme ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-white/40'}`}>Unauthorized Tag</p>
        </div>
      );
    case 'CHARGING':
      return <ChargingScreen data={data} isConnecting={false} onStop={() => { }} isLightTheme={isLightTheme} />;
    case 'SUMMARY':
      return (
        <div className="flex-1 flex flex-col p-16 pt-20 animate-in fade-in duration-700">
          <div className="mb-3 flex justify-between items-end">
            <h2 className={`text-4xl font-black uppercase italic tracking-tighter transition-colors ${textPrimary}`}>Summary</h2>
            <span className={`text-[12px] font-black uppercase tracking-widest mb-1 opacity-60 transition-colors ${textSecondary}`}>SESS #992-VP</span>
          </div>
          <div className={`border-[3px] rounded-[32px] p-4 mb-3 shadow-xl transition-all duration-500 ${isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/20'}`}>
            <div className="space-y-4">
              <div className={`flex justify-between items-baseline border-b-2 pb-4 ${isLightTheme ? 'border-slate-200' : 'border-white/10'}`}>
                <span className={`text-xl font-black uppercase tracking-widest transition-colors ${textSecondary}`}>Total Energy</span>
                <span className="text-[#00e5ff] text-3xl font-black tracking-tighter">{data.energyDelivered.toFixed(2)}<span className="text-lg ml-2">kWh</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className={`text-[12px] font-black uppercase tracking-[0.4em] transition-colors ${textSecondary}`}>Session Time</span>
                <span className={`text-2xl font-black tracking-tight transition-colors ${textPrimary}`}>{formatSummaryTime(data.elapsedTime)}</span>
              </div>
            </div>
          </div>
          <div className={`flex flex-col items-center justify-center gap-4 py-4 border-[3px] rounded-[40px] transition-all duration-500 ${isLightTheme ? 'bg-white border-slate-200 shadow-md' : 'bg-white/5 border-white/10'}`}>
            <div className={`w-20 h-20 p-3 rounded-2xl shadow-xl transition-colors ${isLightTheme ? 'bg-slate-100' : 'bg-white'}`}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="black">
                <path d="M3 3h4v4H3zM3 10h1v1H3zM3 13h4v4H3zM5 5h0M5 15h0M10 3h1v1h-1zM10 10h4v4h-4zM10 17h1v4h-1zM13 3h4v4h-4zM13 17h4v4h-4zM17 10h1v1h-1zM17 13h1v1h-1zM20 3h1v4h-1zM20 10h1v1h-1zM20 13h1v8h-1zM5 5h1M11 11h2v2h-2zM14 4h2M4 14h2M14 18h2M18 4h2" />
              </svg>
            </div>
            <div className="text-center">
              <span className={`text-sm font-black uppercase tracking-[0.5em] transition-colors ${textPrimary}`}>Scan for info</span>
            </div>
          </div>
        </div>
      );
    case 'ERROR':
      return (
        <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-10 px-12 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 rounded-[24px] bg-red-500/20 border-[3px] border-red-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <svg className="text-red-500" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className={`text-[42px] font-black uppercase italic tracking-tighter leading-none mb-4 transition-colors ${textPrimary}`}>Fault</h2>
          <div className={`border-2 rounded-[28px] p-5 w-full max-w-xs shadow-xl transition-all duration-500 ${isLightTheme ? 'bg-red-50 border-red-200' : 'bg-white/5 border-red-500/20'}`}>
            <p className="text-[#00e5ff] text-lg font-black uppercase tracking-[0.2em] mb-2">E-402</p>
            <p className={`text-[11px] font-black uppercase tracking-widest leading-relaxed transition-colors ${textSecondary}`}>
              Ground fault detected.<br />Safety shutdown engaged.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-1 opacity-40">
            <p className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors ${textPrimary}`}>System ID: VP-9912-A</p>
            <p className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors ${textPrimary}`}>Contact Support: +49 800 123 456</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default App;
