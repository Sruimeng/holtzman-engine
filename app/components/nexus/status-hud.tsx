'use client';

import { Icon } from '@iconify/react';
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
      className={`
        fixed top-0 right-0 z-40
        ml-20 left-20 h-12
        flex items-center justify-between
        border-b border-white/5
        px-6 ${GLASS}
      `}
    >
      {/* Left: Time */}
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon icon="mdi:clock-outline" className="text-lg" />
        <span className="text-sm font-mono">{clock}</span>
      </div>

      {/* Center: Title */}
      <h1 className="text-sm text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
        {title}
      </h1>

      {/* Right: Signal + Session */}
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:signal-cellular-2" className="text-lg text-cyan-400/70" />
          <span className="font-mono">15%</span>
        </div>

        <div className="flex items-center gap-2">
          <Icon icon="mdi:pound" className="text-lg" />
          <span className="font-mono">{sessionId.replace('#', '')}</span>
        </div>
      </div>
    </header>
  );
}
