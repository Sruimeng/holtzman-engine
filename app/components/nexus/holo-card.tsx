import { XMarkdown } from '@ant-design/x-markdown';
import { Icon } from '@sruim/nexus-design';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getAgentTheme } from '../../constants/static/agent-roles';
import { t, type Locale } from '../../constants/static/i18n';
import type { AgentState } from '../../store/orchestration';

interface HoloCardProps {
  agent: AgentState;
  wide?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  locale?: Locale;
}

// Map 'color' key to Tailwind border class for STREAMING state
const ACTIVE_BORDER: Record<string, string> = {
  rose: 'border-rose-500/50',
  amber: 'border-amber-500/50',
  purple: 'border-purple-500/50',
  emerald: 'border-emerald-500/50',
  blue: 'border-blue-500/50',
  white: 'border-white/50',
  teal: 'border-teal-500/50',
};

// Map 'color' key to Tailwind shadow class for STREAMING state
const ACTIVE_GLOW: Record<string, string> = {
  rose: 'shadow-[0_0_30px_-10px_rgba(244,63,94,0.3)]',
  amber: 'shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]',
  purple: 'shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]',
  emerald: 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]',
  blue: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
  white: 'shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]',
  teal: 'shadow-[0_0_30px_-10px_rgba(20,184,166,0.3)]',
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

const MD_STYLES = [
  'break-words leading-relaxed text-slate-50', // High Contrast
  '[&_p]:m-0 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5',
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:bg-slate-950/50 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-white/5',
  '[&_h1]:text-base [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:my-2',
  '[&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-800/50 [&_code]:px-1 [&_code]:rounded',
  '[&_a]:text-blue-400 [&_a]:underline',
].join(' ');

const Waveform = ({ color }: { color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const bars = 60;
    const barWidth = rect.width / bars;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = color;
      // Add a slight glow to the bars
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;

      for (let i = 0; i < bars; i++) {
        // Pseudo-random waveform simulation
        const noise = Math.sin(i * 0.2 + frame * 0.1) * Math.cos(i * 0.5 - frame * 0.2);
        const height = Math.max(2, (noise + 1) * 8 + Math.random() * 4);

        const x = i * barWidth;
        const y = rect.height - height;
        // Add spacing between bars
        ctx.fillRect(x, y, barWidth - 2, height);
      }

      frame += 0.2;
      requestAnimationFrame(draw);
    };

    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [color]);

  return <canvas ref={canvasRef} className="h-8 w-full" />;
};

const Avatar = ({
  role,
  color,
  isStreaming,
}: {
  role: string;
  color: string;
  isStreaming: boolean;
}) => {
  const seed = role;
  const url = `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;

  // Dynamic border color for avatar
  const borderColor = isStreaming ? TEXT[color].replace('text-', 'border-') : 'border-slate-600';

  return (
    <div
      className={`h-10 w-10 rounded-full border-2 overflow-hidden transition-colors duration-300 ${borderColor}`}
    >
      <img src={url} alt={role} className="h-full w-full bg-slate-800" />
    </div>
  );
};

export const HoloCard = ({
  agent,
  wide,
  collapsed = false,
  onCollapsedChange,
  locale = 'zh',
}: HoloCardProps) => {
  const theme = getAgentTheme(agent.role);
  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const [showCursor, setShowCursor] = useState(true);

  const isStreaming = agent.status === 'streaming';
  const isThinking = agent.status === 'thinking' && !agent.content;
  const isDone = agent.status === 'done';

  // Cursor blink effect
  useEffect(() => {
    const id = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!isStreaming || userScrolledRef.current) return;
    contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
  }, [agent.content, isStreaming]);

  const handleScroll = () => {
    if (!contentRef.current || !isStreaming) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    userScrolledRef.current = scrollHeight - scrollTop - clientHeight > 50;
  };

  // Base styles
  const baseClasses =
    'relative flex flex-col rounded-2xl border bg-slate-900/40 backdrop-blur-xl transition-all duration-300';

  // State-specific styles
  const stateClasses = isStreaming
    ? `${ACTIVE_BORDER[theme.color]} ${ACTIVE_GLOW[theme.color]} ring-1 ring-white/10`
    : 'border-white/5 shadow-none hover:border-white/10 transition-colors'; // IDLE state

  const containerClasses = [
    baseClasses,
    stateClasses,
    wide && 'w-full max-w-xl mx-auto', // Max width constraint
    !wide && 'w-full',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', mass: 1, stiffness: 170, damping: 26 }} // Matches spec
      className={containerClasses}
    >
      {/* Header */}
      <div
        className="relative flex cursor-pointer items-center gap-4 overflow-hidden border-b border-white/5 px-6 py-4"
        onClick={() => isDone && onCollapsedChange?.(!collapsed)}
      >
        {/* Ambient Light for Header */}
        {isStreaming && (
          <div
            className={`absolute -left-4 top-0 bottom-0 w-20 bg-gradient-to-r from-${theme.color}-500/20 to-transparent blur-xl`}
          />
        )}

        <Avatar role={agent.role} color={theme.color} isStreaming={isStreaming} />
        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-between">
            <div
              className={`text-sm font-bold font-mono uppercase tracking-[0.2em] ${isStreaming ? TEXT[theme.color] : 'text-slate-200'}`}
            >
              {locale === 'zh' ? theme.labelCn : theme.label} {t('card.unit', locale)}
            </div>
            {isStreaming && (
              <div className="flex gap-1">
                <span
                  className={`block h-1.5 w-1.5 rounded-full ${TEXT[theme.color].replace('text-', 'bg-')} animate-ping`}
                />
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <div
              className={`h-1 w-1 rounded-full ${isStreaming ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}
            />
            <div className="text-[10px] text-slate-500 tracking-wider font-mono uppercase">
              {isStreaming
                ? t('card.active', locale)
                : isThinking
                  ? t('card.initializing', locale)
                  : t('card.standby', locale)}
            </div>
          </div>
        </div>

        {isDone && (
          <button className="text-slate-500 transition-colors hover:text-slate-300">
            <Icon
              icon={collapsed ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'}
              className="text-lg"
            />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Content Body */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="scrollbar-thumb-white/10 scrollbar-track-transparent max-h-[400px] min-h-[160px] flex-1 overflow-y-auto p-6 scrollbar-thin"
            >
              {agent.error && (
                <div className="mb-4 border border-rose-500/20 rounded bg-rose-500/10 p-3 text-sm text-rose-300">
                  {t('card.error', locale)}: {agent.error}
                </div>
              )}

              {isThinking ? (
                <div className="flex flex-col animate-pulse gap-2">
                  <div className="h-2 w-2/3 rounded bg-slate-700/50" />
                  <div className="h-2 w-1/2 rounded bg-slate-700/50" />
                  <div className="h-2 w-3/4 rounded bg-slate-700/50" />
                </div>
              ) : agent.content ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <XMarkdown className={MD_STYLES}>{agent.content}</XMarkdown>
                  {isStreaming && (
                    <span
                      className={`inline-block w-2 h-5 align-middle ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} bg-blue-500`}
                    />
                  )}
                </div>
              ) : (
                <span className="text-sm text-slate-600 italic">{t('card.awaiting', locale)}</span>
              )}
            </div>

            {/* Footer Visualizer */}
            {isStreaming && (
              <div className="px-6 pb-4 pt-2">
                <Waveform color={theme.hex} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
