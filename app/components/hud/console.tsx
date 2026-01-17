import { Sparkles } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { useSSEStream } from '@/hooks/use-sse-stream';
import { WaveformVisualizer } from './waveform-visualizer';

interface Props {
  sseUrl?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function Console({ sseUrl, onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { send: sseSend, isConnected } = useSSEStream({
    url: sseUrl || '/api/chat/stream',
    autoConnect: Boolean(sseUrl),
  });

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    if (sseUrl) {
      sseSend(trimmed);
    } else {
      onSend?.(trimmed);
    }
    setValue('');
  }, [value, disabled, sseUrl, sseSend, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const isTyping = value.length > 0 || isConnected;

  return (
    <footer className="glass-panel fixed bottom-0 left-16 right-0 z-40">
      <div className="border-b border-cyan-400/20 px-4 py-2">
        <WaveformVisualizer isActive={isTyping} height={40} samples={64} />
      </div>

      <div className="flex items-end gap-4 p-4">
        <textarea
          ref={textareaRef}
          className="text-holo placeholder:text-dim max-h-[120px] min-h-[40px] flex-1 resize-none border-b border-cyan-400/20 bg-transparent pb-2 text-sm font-mono outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_2px_8px_rgba(56,189,248,0.15)]"
          placeholder="Typing command..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />

        <button
          className={`rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-3 text-white transition-all hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] ${
            disabled ? 'opacity-40' : ''
          }`}
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send"
        >
          <Sparkles size={18} />
        </button>
      </div>
    </footer>
  );
}
