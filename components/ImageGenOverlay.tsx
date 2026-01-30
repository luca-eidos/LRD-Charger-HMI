
import React, { useState } from 'react';
import { generateHMIBackground } from '../services/geminiService';
import { ImageSize } from '../types';

interface ImageGenOverlayProps {
  onClose: () => void;
  onImageGenerated: (url: string) => void;
  isLightTheme?: boolean;
}

const ImageGenOverlay: React.FC<ImageGenOverlayProps> = ({ onClose, onImageGenerated, isLightTheme = false }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const url = await generateHMIBackground(prompt, size);
      onImageGenerated(url);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate background. Ensure an API key is selected.");
    } finally {
      setLoading(false);
    }
  };

  const sizes: ImageSize[] = ['1K', '2K', '4K'];

  const overlayBg = isLightTheme ? 'bg-white/95' : 'bg-[#0d0f11]/95';
  const textPrimary = isLightTheme ? 'text-slate-900' : 'text-white';
  const textSecondary = isLightTheme ? 'text-slate-500' : 'text-white/80';
  const divider = isLightTheme ? 'border-slate-200' : 'border-white/10';

  return (
    <div className={`absolute inset-0 z-50 backdrop-blur-2xl p-12 flex animate-in slide-in-from-bottom duration-500 ${overlayBg}`}>
      {/* Left Column: Input */}
      <div className={`w-[50%] flex flex-col pr-12 border-r transition-colors ${divider}`}>
        <div className="mb-10">
          <h2 className="text-[#00e5ff] text-4xl font-black uppercase italic tracking-tighter">AI Theme Engine</h2>
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <label className={`text-xs font-black uppercase tracking-[0.4em] transition-colors ${textSecondary}`}>Visual Atmosphere</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Minimalist circuit blue, futuristic neon abstract, deep sea industrial..."
              className={`w-full h-48 border-2 rounded-2xl p-6 text-xl outline-none transition-all resize-none shadow-inner ${isLightTheme ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-[#00e5ff]' : 'bg-white/5 border-white/20 text-white placeholder:text-white/20 focus:border-[#00e5ff]'}`}
            />
          </div>

          <div className="space-y-4">
            <label className={`text-xs font-black uppercase tracking-[0.4em] transition-colors ${textSecondary}`}>Render Resolution</label>
            <div className="flex gap-4">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-5 rounded-xl border-2 transition-all font-black text-lg ${
                    size === s 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black shadow-[0_5px_20px_rgba(0,229,255,0.4)]' 
                    : isLightTheme 
                      ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Actions & Info */}
      <div className="flex-1 flex flex-col pl-12 justify-center">
        <div className="text-center mb-12">
          <p className={`text-xl font-bold leading-relaxed mb-6 transition-colors ${isLightTheme ? 'text-slate-600' : 'text-white/90'}`}>
            Describe a theme and our Gemini engine will generate a custom industrial backdrop for this station.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#00e5ff]/10 rounded-full border-2 border-[#00e5ff]/40">
            <span className="text-[#00e5ff] text-xs font-black uppercase tracking-widest">Premium Customization</span>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/40 rounded-xl p-5 flex items-center gap-4">
              <svg className="text-red-500 shrink-0" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-red-600 text-sm font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-10 font-black uppercase tracking-[0.4em] rounded-2xl disabled:opacity-50 flex items-center justify-center gap-5 active:scale-[0.98] transition-all shadow-xl text-xl ${isLightTheme ? 'bg-slate-900 text-white hover:bg-black' : 'bg-white text-black hover:bg-slate-100'}`}
          >
            {loading ? (
              <>
                <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${isLightTheme ? 'border-white' : 'border-black'}`}></div>
                <span>Generating Art...</span>
              </>
            ) : (
              'Apply New Theme'
            )}
          </button>

          <button 
            onClick={onClose}
            className={`w-full py-6 border rounded-2xl font-black uppercase tracking-[0.3em] transition-all text-sm ${isLightTheme ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'}`}
          >
            Back to Station
          </button>
        </div>

        <div className={`mt-auto text-center pt-8 border-t transition-colors ${divider}`}>
           <p className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${isLightTheme ? 'text-slate-300' : 'text-white/30'}`}>Integrated Gemini Vision Engine v3.0 Pro</p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenOverlay;
