import { memo, useEffect, useRef } from 'react';

interface Props {
  agentId: string;
  content: string;
  isStreaming: boolean;
}

function Cursor() {
  return <span className="bg-electric ml-0.5 inline-block h-4 w-2 animate-pulse" />;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded">$1</code>')
    .replace(/\n/g, '<br />');
}

export const MessageStream = memo(function MessageStream({ agentId, content, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !isStreaming) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [content, isStreaming]);

  return (
    <div ref={ref} className="group py-3">
      <div className="text-electric/60 mb-1 text-xs font-mono">{agentId}</div>

      <div
        className="text-holo text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      />

      {isStreaming && <Cursor />}
    </div>
  );
});
