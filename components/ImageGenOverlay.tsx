
import React, { useState } from 'react';
import { generateHMIBackground } from '../services/geminiService';
import { ImageSize } from '../types';

interface ImageGenOverlayProps {
  onClose: () => void;
  onImageGenerated: (url: string) => void;
}

const ImageGenOverlay: React.FC<ImageGenOverlayProps> = ({ onClose, onImageGenerated }) => {
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

  return (
    <div className="absolute inset-0 z-50 bg-[#0d0f11]/95 backdrop-blur-2xl p-12 flex animate-in slide-in-from-bottom duration-500">
      {/* Left Column: Input */}
      <div className="w-[50%] flex flex-col pr-12 border-r border-white/10">
        <div className="mb-10">
          <h2 className="text-[#00e5ff] text-4xl font-black uppercase italic tracking-tighter">AI Theme Engine</h2>
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <label className="text-white/80 text-xs font-black uppercase tracking-[0.4em]">Visual Atmosphere</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Minimalist circuit blue, futuristic neon abstract, deep sea industrial..."
              className="w-full h-48 bg-white/5 border-2 border-white/20 rounded-2xl p-6 text-white text-xl placeholder:text-white/20 focus:border-[#00e5ff] outline-none transition-all resize-none shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-white/80 text-xs font-black uppercase tracking-[0.4em]">Render Resolution</label>
            <div className="flex gap-4">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-5 rounded-xl border-2 transition-all font-black text-lg ${
                    size === s 
                    ? 'bg-[#00e5ff] border-[#00e5ff] text-black shadow-[0_5px_20px_rgba(0,229,255,0.4)]' 
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
          <p className="text-white/90 text-xl font-bold leading-relaxed mb-6">
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
              <p className="text-red-300 text-sm font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full py-10 bg-white text-black font-black uppercase tracking-[0.4em] rounded-2xl disabled:opacity-50 flex items-center justify-center gap-5 active:scale-[0.98] transition-all shadow-[0_15px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_70px_rgba(255,255,255,0.25)] text-xl"
          >
            {loading ? (
              <>
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Art...</span>
              </>
            ) : (
              'Apply New Theme'
            )}
          </button>

          <button 
            onClick={onClose}
            className="w-full py-6 bg-white/5 border border-white/20 rounded-2xl text-white/80 font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-sm"
          >
            Back to Station
          </button>
        </div>

        <div className="mt-auto text-center pt-8 border-t border-white/5">
           <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Gemini Vision Engine v3.0 Pro</p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenOverlay;
