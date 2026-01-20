'use client';

import { cn, Icon } from '@sruim/nexus-design';
import { useEffect, useState } from 'react';

interface StatusHudProps {
  title?: string;
  sessionId?: string;
}

const GLASS = 'bg-slate-900/30 backdrop-blur-xl';

export function StatusHud({ title = 'Nexus Boardroom', sessionId = '#020617' }: StatusHudProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clock = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <header
      className={cn(
        'fixed top-4 right-6 z-40',
        'left-72 h-14 rounded-2xl',
        'flex items-center justify-between',
        'border border-white/10',
        'px-6 shadow-lg shadow-black/20',
        GLASS,
      )}
    >
      {/* Left: Time */}
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon icon="i-carbon-time" className="text-lg" />
        <span className="text-sm font-mono">{clock}</span>
      </div>

      {/* Center: Title */}
      <h1 className="text-sm text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
        {title}
      </h1>

      {/* Right: Signal + Session */}
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <Icon icon="i-carbon-wifi" className="text-lg text-cyan-400/70" />
          <span className="font-mono">15%</span>
        </div>

        <div className="flex items-center gap-2">
          <Icon icon="i-carbon-hashtag" className="text-lg" />
          <span className="font-mono">{sessionId.replace('#', '')}</span>
        </div>
      </div>
    </header>
  );
}
