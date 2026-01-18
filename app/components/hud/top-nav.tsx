import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  sessionTitle?: string;
  godModeValue?: string;
  onGodModeChange?: (value: string) => void;
  onTitleChange?: (title: string) => void;
}

const GOD_MODES = [
  { code: 'Balanced', label: 'Balanced' },
  { code: 'Creative', label: 'Creative' },
  { code: 'Precise', label: 'Precise' },
  { code: 'Fast', label: 'Fast' },
];

function SessionInput({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
  return (
    <div className="relative flex-1">
      <div className="group relative overflow-hidden rounded-lg border-2 border-cyan-400 bg-gradient-to-br from-slate-800/90 to-slate-900/90 px-4 py-3 shadow-[0_0_30px_rgba(6,182,212,0.5),0_0_60px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-sm text-cyan-200/70 font-mono shrink-0">Session:</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white font-mono outline-none placeholder:text-cyan-200/40 selection:bg-cyan-400/30"
            placeholder="Untitled Session"
          />
        </div>
      </div>
    </div>
  );
}

function GodModeDropdown({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    onChange?.(code);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        className="group relative overflow-hidden rounded-lg border border-white/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90 px-4 py-3 text-sm font-mono transition-all hover:border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]"
        onClick={() => setOpen(!open)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-white/60">God Mode:</span>
          <span className="text-white font-medium">{value}</span>
          <ChevronDown size={14} className={`text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute left-1/2 h-[100px] w-[200px] bg-cyan-500/20 blur-[50px] -top-12 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col gap-1">
              {GOD_MODES.map(({ code, label }) => {
                const isActive = value === code;
                return (
                  <button
                    key={code}
                    className={`
                      group relative flex items-center overflow-hidden rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-300
                      ${
                        isActive
                          ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    onClick={() => handleSelect(code)}
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
          </div>
        </>
      )}
    </div>
  );
}

export function TopNav({
  sessionTitle = '',
  godModeValue = 'Balanced',
  onGodModeChange,
  onTitleChange,
}: Props) {
  return (
    <header className="fixed left-16 right-0 top-0 z-40 flex flex-col">
      <div className="relative flex h-16 items-center gap-6 px-6 bg-slate-950/60 backdrop-blur-xl border-b border-white/10">
        {/* Subtle glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/5 blur-[100px]" />

        <div className="relative z-10 flex flex-1 items-center gap-6">
          <SessionInput value={sessionTitle} onChange={onTitleChange} />
          <GodModeDropdown value={godModeValue} onChange={onGodModeChange} />
        </div>

        {/* Bottom edge glow line */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>
    </header>
  );
}
