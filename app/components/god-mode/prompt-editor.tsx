import { useCallback } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onReset?: () => void;
  maxLength?: number;
}

export function PromptEditor({ value, onChange, onSave, onReset, maxLength = 2000 }: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.9;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-dim text-xs tracking-widest font-mono uppercase">System Prompt</span>
        <span className={`text-xs font-mono ${isNearLimit ? 'text-critic' : 'text-dim'}`}>
          {charCount}/{maxLength}
        </span>
      </div>

      <textarea
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        rows={6}
        placeholder="Inject custom instructions..."
        className="text-holo focus:border-electric/50 placeholder:text-dim/50 w-full resize-none border border-white/8 rounded bg-transparent px-3 py-2 text-sm font-mono focus:outline-none"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onReset}
          className="group relative overflow-hidden border border-white/5 rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <span className="relative z-10 tracking-wider">RESET</span>
          <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-current opacity-30" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-current opacity-30" />
        </button>
        <button
          onClick={onSave}
          className="group relative overflow-hidden rounded-lg border border-cyan-500/50 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
        >
          <div className="absolute inset-0 skew-x-12 animate-pulse from-transparent via-cyan-400/10 to-transparent bg-gradient-to-r" />
          <span className="relative z-10 tracking-wider">SAVE</span>
          <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-current opacity-30" />
          <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-current opacity-30" />
        </button>
      </div>
    </div>
  );
}
