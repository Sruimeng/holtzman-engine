import { XMarkdown } from '@ant-design/x-markdown';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { getAgentTheme } from '../../constants/static/agent-roles';
import type { AgentState } from '../../store/orchestration';

interface HoloCardProps {
  agent: AgentState;
  wide?: boolean;
}

const BORDER_COLOR: Record<string, string> = {
  rose: 'border-rose-500/40',
  amber: 'border-amber-500/40',
  purple: 'border-purple-500/40',
  emerald: 'border-emerald-500/40',
  blue: 'border-blue-500/40',
  white: 'border-white/40',
  teal: 'border-teal-500/40',
};

const TEXT: Record<string, string> = {
  rose: 'text-rose-500',
  amber: 'text-amber-500',
  purple: 'text-purple-500',
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  white: 'text-white',
  teal: 'text-teal-500',
};

const GLOW: Record<string, string> = {
  rose: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  emerald: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  white: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]',
  teal: 'shadow-[0_0_20px_rgba(20,184,166,0.4)]',
};

const SKELETON_HINT: Record<string, string> = {
  critic: 'Sharpening critical lens...',
  historian: 'Searching temporal archives...',
  expander: 'Expanding possibility space...',
  pragmatist: 'Calculating practical vectors...',
  verifier: 'Initializing truth scanners...',
  synthesizer: 'Weaving knowledge threads...',
  mediator: 'Calibrating balance matrices...',
};

const MD_STYLES = [
  'break-words leading-relaxed text-text-primary',
  '[&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5',
  '[&_pre]:my-1 [&_pre]:overflow-x-auto [&_pre]:bg-slate-800/50 [&_pre]:p-2 [&_pre]:rounded',
  '[&_h1]:text-base [&_h1]:font-semibold [&_h1]:my-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:my-1',
  '[&_code]:break-all [&_code]:text-xs [&_code]:text-cyan-300 [&_a]:text-text-accent [&_a]:underline',
].join(' ');

const Skeleton = ({ role }: { role: string }) => (
  <div className="space-y-2">
    <div className="skeleton-line w-full" />
    <div className="skeleton-line w-4/5" />
    <div className="skeleton-line w-3/5" />
    <p className="mt-3 text-xs text-text-secondary">{SKELETON_HINT[role] || 'Connecting...'}</p>
  </div>
);

export const HoloCard = ({ agent, wide }: HoloCardProps) => {
  const theme = getAgentTheme(agent.role);
  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);

  const borderColor = BORDER_COLOR[theme.color] || 'border-gray-500/40';
  const text = TEXT[theme.color] || 'text-gray-500';
  const glow = agent.status === 'streaming' ? GLOW[theme.color] || '' : '';

  const isThinking = agent.status === 'thinking' && !agent.content;
  const isStreaming = agent.status === 'streaming';
  const isError = agent.status === 'error';

  // Calculate mock latency (random for demo)
  const [latency, setLatency] = useState(() =>
    ((agent.createdAt ? Date.now() - agent.createdAt : 0) / 1000).toFixed(2),
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLatency(((agent.createdAt ? Date.now() - agent.createdAt : 0) / 1000).toFixed(2));
  }, [agent.createdAt, agent.status]);

  useEffect(() => {
    if (agent.status === 'done') {
      userScrolledRef.current = false;
      return;
    }
    if (!isStreaming || userScrolledRef.current) return;
    contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
  }, [agent.content, agent.status, isStreaming]);

  const handleScroll = () => {
    if (!contentRef.current || !isStreaming) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    userScrolledRef.current = scrollHeight - scrollTop - clientHeight > 50;
  };

  const cls = [
    'glass-card rounded-lg border flex flex-col transition-shadow duration-300',
    borderColor,
    glow,
    isThinking && 'animate-pulse',
    isError && 'border-red-500/40',
    wide && 'w-full max-w-[600px]',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <div className="h-12 flex items-center gap-2 border-b border-white/5 px-4">
        <Icon icon={theme.icon} className={`text-lg ${text}`} />
        <span className={`text-sm font-semibold tracking-widest font-mono uppercase ${text}`}>
          {theme.label}
        </span>
      </div>

      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="max-h-80 min-h-40 flex-1 overflow-y-auto p-6 scrollbar-thin"
      >
        {agent.error && (
          <div className="mb-3 rounded bg-red-900/50 p-2 text-sm text-red-300">{agent.error}</div>
        )}
        {isThinking ? (
          <Skeleton role={agent.role} />
        ) : agent.content ? (
          <XMarkdown className={MD_STYLES}>{agent.content}</XMarkdown>
        ) : (
          <span className="text-sm text-text-secondary">Awaiting response...</span>
        )}
      </div>

      <div className="h-8 flex items-center justify-between border-t border-white/5 px-4">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${isStreaming || isThinking ? 'bg-cyan-400 animate-pulse' : 'bg-text-secondary'}`}
          />
          <span className="text-[10px] text-text-secondary font-mono">
            {isThinking ? 'Thinking...' : isStreaming ? 'Masking...' : 'Idle'}
          </span>
        </div>
        <span className="text-[10px] text-text-secondary font-mono">Latency data, {latency}ms</span>
      </div>
    </div>
  );
};
