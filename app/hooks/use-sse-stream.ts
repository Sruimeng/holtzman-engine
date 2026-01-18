import { Multiplexer } from '@/lib/sse/multiplexer';
import { StreamClient } from '@/lib/sse/stream-client';
import { useChatStore } from '@/store/chat-store';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSSEStreamConfig {
  url: string;
  autoConnect?: boolean;
}

export function useSSEStream({ url, autoConnect = false }: UseSSEStreamConfig) {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<StreamClient | null>(null);
  const multiplexerRef = useRef<Multiplexer | null>(null);
  const turnIdRef = useRef<string | null>(null);

  const { sendMessage, appendChunk, finishStream } = useChatStore();

  const appendChunkRef = useRef(appendChunk);
  const finishStreamRef = useRef(finishStream);

  appendChunkRef.current = appendChunk;
  finishStreamRef.current = finishStream;

  useEffect(() => {
    multiplexerRef.current = new Multiplexer({
      onChunk: ({ agentId, content }) => {
        if (!turnIdRef.current) return;
        appendChunkRef.current(agentId, turnIdRef.current, content);
      },
      onComplete: (agentId) => {
        if (!turnIdRef.current) return;
        finishStreamRef.current(agentId, turnIdRef.current);
      },
    });

    clientRef.current = new StreamClient({
      url,
      onConnect: () => setIsConnected(true),
      onError: () => setIsConnected(false),
      onMessage: (event) => {
        if (!multiplexerRef.current) return;

        switch (event.type) {
          case 'stream':
            multiplexerRef.current.push(event.agentId, event.data);
            break;
          case 'done':
            multiplexerRef.current.complete(event.agentId);
            break;
          case 'error':
            multiplexerRef.current.complete(event.agentId);
            break;
        }
      },
    });

    if (autoConnect) {
      clientRef.current.connect();
    }

    return () => {
      clientRef.current?.disconnect();
      multiplexerRef.current?.clear();
    };
  }, [url, autoConnect]);

  const connect = useCallback(() => {
    clientRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
    setIsConnected(false);
  }, []);

  const send = useCallback(
    async (content: string) => {
      const turnId = sendMessage(content);
      turnIdRef.current = turnId;

      // POST to trigger SSE response
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, turnId }),
        credentials: 'include',
      });
    },
    [url, sendMessage],
  );

  return {
    send,
    connect,
    disconnect,
    isConnected,
  };
}
