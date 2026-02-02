
import React from 'react';
import { TranslateFn } from '../i18n';

interface IdleScreenProps {
  onStart: () => void;
  isLightTheme?: boolean;
  t: TranslateFn;
}

interface PricingBoxesProps {
  textPrimary: string;
  textSecondary: string;
  blockClasses: string;
  t: TranslateFn;
}

interface PricingBoxProps {
  label: string;
  value: string;
  unit: string;
  textPrimary: string;
  textSecondary: string;
  blockClasses: string;
  subLabel?: string;
}

const PricingBox: React.FC<PricingBoxProps> = ({
  label,
  value,
  unit,
  textPrimary,
  textSecondary,
  blockClasses,
  subLabel,
}) => (
  <div className={`border-2 rounded-2xl p-4 flex justify-between items-center transition-all ${blockClasses}`}>
    <div className="flex flex-col">
      <span className={`text-lg font-black uppercase tracking-[0.2em] transition-colors ${textPrimary}`}>{label}</span>
      {subLabel ? (
        <span className="text-[10px] text-[#00e5ff] font-black uppercase tracking-[0.3em] mt-1 italic">{subLabel}</span>
      ) : null}
    </div>
    <span className={`text-4xl font-black tracking-tighter transition-colors ${textPrimary}`}>
      {value}{' '}
      <span className={`text-sm font-bold uppercase tracking-[0.1em] ml-1 ${textSecondary}`}>{unit}</span>
    </span>
  </div>
);

const PricingBoxes: React.FC<PricingBoxesProps> = ({
  textPrimary,
  textSecondary,
  blockClasses,
  t,
}) => (
  <div className="flex-1 space-y-3">
    <PricingBox
      label={t('pricingEnergy')}
      value="€0.55"
      unit="/ kWh"
      textPrimary={textPrimary}
      textSecondary={textSecondary}
      blockClasses={blockClasses}
    />
    <PricingBox
      label={t('pricingInitial')}
      value="€1.00"
      unit={t('pricingFlat')}
      textPrimary={textPrimary}
      textSecondary={textSecondary}
      blockClasses={blockClasses}
    />
    <PricingBox
      label={t('pricingIdleFee')}
      value="€0.30"
      unit={t('pricingPerMin')}
      textPrimary={textPrimary}
      textSecondary={textSecondary}
      blockClasses={blockClasses}
      subLabel={t('pricingPostSession')}
    />
  </div>
);

const IdleScreen: React.FC<IdleScreenProps> = ({ onStart, isLightTheme = false, t }) => {
  const textPrimary = isLightTheme ? 'text-slate-900' : 'text-white';
  const textSecondary = isLightTheme ? 'text-slate-400' : 'text-white/80';
  const blockClasses = isLightTheme
    ? 'bg-slate-50 border-slate-200 shadow-sm hover:bg-slate-100'
    : 'bg-white/5 border-white/10 hover:bg-white/10';

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 overflow-hidden">
      {/* Power Header with QR */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-4">
            <span className={`text-[80px] leading-none font-black tracking-tighter transition-colors ${textPrimary}`}>22</span>
            <span className="text-[#00e5ff] text-6xl font-black italic tracking-tighter">kW</span>
          </div>
          <div className={`text-xs font-black uppercase tracking-[0.5em] mt-3 transition-colors ${textSecondary}`}>{t('maximumAvailablePower')}</div>
        </div>

        {/* Support/Info QR Code */}
        <div className={`p-3 rounded-2xl shadow-lg ${isLightTheme ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="black">
              <path d="M3 3h4v4H3zM3 13h4v4H3zM13 3h4v4h-4zM13 13h4v4h-4zM3 10h1v1H3zM10 3h1v1h-1zM10 10h4v4h-4zM17 10h1v1h-1zM20 10h1v1h-1zM10 17h1v4h-1zM17 17h4v4h-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pricing Module - Optimized for high visibility */}
      <PricingBoxes
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        blockClasses={blockClasses}
        t={t}
      />
    </div>
  );
};

export default IdleScreen;
