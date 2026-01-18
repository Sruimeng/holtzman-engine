import { Sparkles } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface Props {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function Console({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend?.(trimmed);
    setValue('');
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const isTyping = value.length > 0;

  return (
    <footer className="fixed bottom-0 left-16 right-0 z-40">
      <div className="mx-4 mb-4 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 p-px">
        <div className="rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/10">
          {/* Activity Indicator */}
          <div className="border-b border-white/5 px-4 py-2 h-[40px] flex items-center">
            <div
              className={`h-1 w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-opacity duration-200 ${
                isTyping ? 'opacity-60' : 'opacity-20'
              }`}
            />
          </div>

          {/* Input area */}
          <div className="flex items-end gap-4 p-4">
            <textarea
              ref={textareaRef}
              className="text-slate-200 placeholder:text-slate-500 max-h-[120px] min-h-[40px] flex-1 resize-none bg-transparent pb-2 text-sm font-mono outline-none"
              placeholder="Typing command..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={disabled}
            />

            <button
              className={`rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-3 text-white transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] ${
                disabled ? 'opacity-40' : ''
              }`}
              onClick={handleSubmit}
              disabled={disabled || !value.trim()}
              aria-label="Send"
            >
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
