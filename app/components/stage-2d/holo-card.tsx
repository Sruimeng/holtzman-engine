import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type AgentType = 'pragmatist' | 'critic' | 'historian' | 'expander';

interface HoloCardProps {
  children: ReactNode;
  agent: AgentType;
  isActive?: boolean;
  className?: string;
}

const agentConfig = {
  pragmatist: {
    label: 'Pragmatist',
    color: 'emerald',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    borderActive: 'border-emerald-500/50',
    shadowActive: 'shadow-[0_0_40px_rgba(16,185,129,0.3),inset_0_0_30px_rgba(16,185,129,0.1)]',
    shadowIdle: 'shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]',
    textColor: 'text-emerald-400',
  },
  critic: {
    label: 'Critic',
    color: 'rose',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    borderActive: 'border-rose-500/50',
    shadowActive: 'shadow-[0_0_40px_rgba(244,63,94,0.3),inset_0_0_30px_rgba(244,63,94,0.1)]',
    shadowIdle: 'shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]',
    textColor: 'text-rose-400',
  },
  historian: {
    label: 'Historian',
    color: 'amber',
    glowColor: 'rgba(251, 191, 36, 0.15)',
    borderActive: 'border-amber-500/50',
    shadowActive: 'shadow-[0_0_40px_rgba(251,191,36,0.3),inset_0_0_30px_rgba(251,191,36,0.1)]',
    shadowIdle: 'shadow-[inset_0_0_20px_rgba(251,191,36,0.1)]',
    textColor: 'text-amber-400',
  },
  expander: {
    label: 'Expander',
    color: 'violet',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    borderActive: 'border-violet-500/50',
    shadowActive: 'shadow-[0_0_40px_rgba(139,92,246,0.3),inset_0_0_30px_rgba(139,92,246,0.1)]',
    shadowIdle: 'shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]',
    textColor: 'text-violet-400',
  },
};

type AgentConfig = (typeof agentConfig)[AgentType];

function TopEdge({ config, isActive }: { config: AgentConfig; isActive: boolean }) {
  return (
    <motion.div
      className={cn(
        'absolute top-0 inset-x-0 h-px',
        'bg-gradient-to-r from-transparent to-transparent',
        `via-${config.color}-400/50`,
      )}
      animate={{ opacity: isActive ? 1 : 0.3 }}
    />
  );
}

function Scanline() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 from-transparent via-white/5 to-transparent bg-gradient-to-b"
      initial={{ y: '-100%' }}
      animate={{ y: '100%' }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function GlowPulse({ glowColor }: { glowColor: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)` }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function CardContent({
  config,
  isActive,
  agent,
  children,
}: {
  config: AgentConfig;
  isActive: boolean;
  agent: AgentType;
  children: ReactNode;
}) {
  return (
    <div className="relative z-10 h-full flex flex-col p-6">
      <div className={cn('text-xs uppercase tracking-[0.2em] mb-4 font-mono', config.textColor)}>
        <motion.span
          className="mr-2 inline-block h-2 w-2 rounded-full bg-current"
          animate={{ opacity: isActive ? [1, 0.4, 1] : 0.4 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {config.label}
      </div>
      <div className="flex-1 text-sm text-slate-300 leading-relaxed font-sans">{children}</div>
      <div className="mt-auto flex justify-between border-t border-white/5 pt-4 text-[10px] text-slate-500 font-mono">
        <span>SYNC: {isActive ? '●' : '○'}</span>
        <span>AGENT_{agent.toUpperCase().slice(0, 4)}</span>
      </div>
    </div>
  );
}

export function HoloCard({ children, agent, isActive = false, className }: HoloCardProps) {
  const config = agentConfig[agent];

  return (
    <motion.div
      className={cn(
        'relative w-80 min-h-[28rem]',
        'backdrop-blur-xl bg-slate-900/40',
        'border rounded-2xl overflow-hidden',
        isActive ? config.borderActive : 'border-white/8',
        isActive ? config.shadowActive : config.shadowIdle,
        className,
      )}
      animate={{
        scale: isActive ? 1.02 : 0.98,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{
        scale: { duration: 0.4, ease: 'easeOut' },
        opacity: { duration: 0.4, ease: 'easeOut' },
      }}
    >
      <TopEdge config={config} isActive={isActive} />
      {isActive && <Scanline />}
      {isActive && <GlowPulse glowColor={config.glowColor} />}
      <CardContent config={config} isActive={isActive} agent={agent}>
        {children}
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-px from-transparent via-white/10 to-transparent bg-gradient-to-r" />
    </motion.div>
  );
}
