import { useChatStore, type Message } from '@/store/chat-store';
import { useEffect, useRef } from 'react';
import { MessageStream } from './message-stream';

interface TurnGroup {
  turnId: string;
  messages: Message[];
}

function groupByTurn(messages: Message[]): TurnGroup[] {
  const groups = new Map<string, Message[]>();

  messages.forEach((msg) => {
    const existing = groups.get(msg.turnId) || [];
    groups.set(msg.turnId, [...existing, msg]);
  });

  return Array.from(groups.entries()).map(([turnId, msgs]) => ({
    turnId,
    messages: msgs,
  }));
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="py-3 text-right">
      <div className="inline-block max-w-[80%] text-left">
        <div className="text-dim mb-1 text-xs font-mono">you</div>
        <div className="text-holo rounded-lg bg-white/5 px-4 py-2 text-sm">{content}</div>
      </div>
    </div>
  );
}

export function MessageList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { messages, streamingAgents } = useChatStore();

  const groups = groupByTurn(messages);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="text-dim flex flex-1 items-center justify-center text-sm">
        No messages yet
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth px-4 space-y-4">
      {groups.map(({ turnId, messages: turnMessages }) => (
        <div key={turnId} className="border-b border-white/5 pb-4">
          {turnMessages.map((msg) =>
            msg.role === 'user' ? (
              <UserMessage key={msg.id} content={msg.content} />
            ) : (
              <MessageStream
                key={msg.id}
                agentId={msg.agentId}
                content={msg.content}
                isStreaming={streamingAgents.has(msg.agentId)}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
}
