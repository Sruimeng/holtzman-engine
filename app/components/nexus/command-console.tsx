import { cn, Icon } from '@sruim/nexus-design';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { t, type Locale } from '../../constants/static/i18n';

interface CommandConsoleProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isThinking?: boolean;
  onStop?: () => void;
  isStreaming?: boolean;
  onNewSession?: () => void;
  locale?: Locale;
}

const SphericalSpectrogram = ({ active }: { active: boolean }) => {
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

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = Math.min(cx, cy) - 6;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Core sphere with gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        cx - radius / 3,
        cy - radius / 3,
        radius / 10,
        cx,
        cy,
        radius,
      );
      gradient.addColorStop(0, active ? '#60A5FA' : '#1e3a8a'); // Lighter blue highlight
      gradient.addColorStop(1, active ? '#2563EB' : '#172554'); // Darker blue base

      ctx.shadowBlur = active ? 30 : 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Wireframe / Longitude lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      const numLines = 8;
      for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        const angle = (i * Math.PI) / numLines + frame * 0.02; // Rotate slowly
        ctx.ellipse(
          cx,
          cy,
          radius * 0.9,
          radius * 0.9 * Math.abs(Math.cos(angle)),
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }

      // Active state: Audio bars radiating from surface
      if (active) {
        const bars = 32;
        for (let i = 0; i < bars; i++) {
          const angle = (i / bars) * Math.PI * 2 - frame * 0.05;
          const noise = Math.sin(frame * 0.5 + i * 0.5) * Math.cos(frame * 0.3 + i * 0.2);
          const barHeight = Math.max(4, (noise + 1) * 10);

          const rInner = radius * 0.95;
          const rOuter = rInner + barHeight;

          const x1 = cx + Math.cos(angle) * rInner;
          const y1 = cy + Math.sin(angle) * rInner;
          const x2 = cx + Math.cos(angle) * rOuter;
          const y2 = cy + Math.sin(angle) * rOuter;

          ctx.strokeStyle = `rgba(147, 197, 253, ${0.5 + noise * 0.4})`; // Pulsing opacity
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        frame += 0.15;
      } else {
        frame += 0.02;
      }

      requestAnimationFrame(draw);
    };

    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [active]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
};

export const CommandConsole = ({
  value,
  onChange,
  onSubmit,
  disabled,
  isThinking,
  onStop,
  isStreaming,
  onNewSession,
  locale = 'zh',
}: CommandConsoleProps) => {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key !== 'Enter' || disabled || !value.trim()) return;
    onSubmit();
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-50 max-w-2xl w-[90%] -translate-x-1/2">
      <div
        className={cn(
          'relative flex items-center gap-4 rounded-full px-6 py-4',
          'bg-slate-950/60 backdrop-blur-2xl',
          'border border-white/10 ring-1 ring-white/5',
          'shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]',
          'transition-all duration-300',
          (isThinking || isStreaming) &&
            'shadow-[0_0_30px_rgba(59,130,246,0.2)] border-blue-500/30',
        )}
      >
        {onNewSession && (
          <button
            onClick={onNewSession}
            className="flex-shrink-0 text-slate-500 transition-colors hover:text-cyan-400"
            title="New Session"
          >
            <Icon icon="i-carbon-add" className="text-xl" />
          </button>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={
            disabled ? t('console.transmitting', locale) : t('console.placeholder', locale)
          }
          className={cn(
            'flex-1 bg-transparent outline-none',
            'text-slate-50 placeholder:text-slate-500',
            'font-mono text-sm tracking-wide',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />

        <div className="h-10 w-10 flex-shrink-0">
          <SphericalSpectrogram active={!!isThinking || !!isStreaming} />
        </div>

        {isStreaming && onStop && (
          <button
            onClick={onStop}
            className={cn(
              'absolute right-20 top-1/2 -translate-y-1/2',
              'px-4 py-1.5 text-xs font-mono font-bold rounded-full',
              'bg-rose-500/20 text-rose-400 border border-rose-500/50',
              'hover:bg-rose-500 hover:text-white',
              'transition-all duration-200',
              'animate-in fade-in zoom-in duration-300',
            )}
          >
            {t('console.abort', locale)}
          </button>
        )}
      </div>
    </div>
  );
};
