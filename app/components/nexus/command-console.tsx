import { type KeyboardEvent } from 'react';

interface CommandConsoleProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isThinking?: boolean;
}

const BARS = 24;

const Wave = ({ active }: { active: boolean }) => (
  <div className="h-8 flex items-end justify-center gap-0.5 px-4">
    {Array.from({ length: BARS }, (_, i) => (
      <div
        key={i}
        className={[
          'w-1 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500',
          active ? 'animate-wave-fast' : 'animate-wave-slow',
        ].join(' ')}
        style={{
          animationDelay: `${i * 40}ms`,
          height: active ? '16px' : '6px',
        }}
      />
    ))}
  </div>
);

export const CommandConsole = ({
  value,
  onChange,
  onSubmit,
  disabled,
  isThinking,
}: CommandConsoleProps) => {
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || disabled || !value.trim()) return;
    onSubmit();
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 max-w-[calc(100vw-32px)] w-[600px] -translate-x-1/2">
      <Wave active={!!isThinking} />

      <div
        className={[
          'glass-base bg-gradient-to-r from-cyan-900/20 to-purple-900/20',
          'h-14 flex items-center gap-3 px-4 rounded-xl',
          'transition-shadow duration-200',
          'focus-within:ring-2 focus-within:ring-cyan-500/50',
        ].join(' ')}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Enter tactical query..."
          className={[
            'flex-1 bg-transparent outline-none',
            'text-text-primary placeholder:text-text-secondary/50',
            'font-mono text-sm',
            disabled && 'opacity-50 cursor-not-allowed',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    </div>
  );
};
