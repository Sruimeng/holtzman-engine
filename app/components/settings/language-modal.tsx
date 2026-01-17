import { Globe, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Lngs } from '@/locales';

interface Props {
  onClose: () => void;
}

function LanguageList({ onSelect }: { onSelect: (code: string) => void }) {
  const { i18n } = useTranslation();

  return (
    <div className="relative z-10 grid grid-cols-2 gap-3">
      {Lngs.map(({ code, label }) => {
        const isActive = i18n.language === code;
        return (
          <button
            key={code}
            className={`
              group relative flex items-center justify-center overflow-hidden rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                  : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
              }
            `}
            onClick={() => onSelect(code)}
          >
            {isActive && (
              <div className="absolute inset-0 skew-x-12 animate-pulse from-transparent via-cyan-400/10 to-transparent bg-gradient-to-r" />
            )}
            <span className="relative z-10 tracking-wider">{label}</span>
            <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-current opacity-30" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-current opacity-30" />
          </button>
        );
      })}
    </div>
  );
}

function Modal({ onClose }: Props) {
  const { t, i18n } = useTranslation('boardroom');

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[420px] overflow-hidden border border-white/10 rounded-2xl bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute left-1/2 h-[120px] w-[250px] bg-cyan-500/20 blur-[60px] -top-16 -translate-x-1/2" />
        <header className="relative z-10 mb-6 flex items-center justify-between">
          <h2 className="text-lg text-cyan-100 tracking-widest font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {t('settings.selectLanguage')}
          </h2>
          <button
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>

        <LanguageList onSelect={handleSelect} />
      </div>
    </div>
  );
}

export function LanguageButton({ expanded }: { expanded: boolean }) {
  const [open, setOpen] = useState(false);

  const isOpen = open && expanded;

  return (
    <>
      <button
        className="hud-icon-btn p-1"
        onClick={() => setOpen(true)}
        aria-label="Change language"
      >
        <Globe size={20} strokeWidth={1.5} />
      </button>

      {isOpen && <Modal onClose={() => setOpen(false)} />}
    </>
  );
}
