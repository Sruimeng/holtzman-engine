import { useEffect, useRef } from 'react';
import type { SSEEvent } from '../utils/sse-parser';
import { parseSSEEvent } from '../utils/sse-parser';

interface UseFetchSSEOptions {
  url: string;
  body: unknown;
  onMessage: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

export const useFetchSSE = ({
  url,
  body,
  onMessage,
  onError,
  enabled = true,
}: UseFetchSSEOptions) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const connect = async () => {
      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
              currentEvent = '';
              continue;
            }

            if (trimmed.startsWith('event: ')) {
              currentEvent = trimmed.slice(7);
              continue;
            }

            if (trimmed.startsWith('data: ') && currentEvent) {
              const raw = trimmed.slice(6);
              if (raw === '[DONE]') continue;

              try {
                const event = parseSSEEvent(currentEvent, raw);
                if (event) {
                  onMessage(event);
                  retryCountRef.current = 0;
                }
              } catch {
                // Skip malformed events
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onError?.(err);

          if (retryCountRef.current < MAX_RETRIES) {
            const delay = INITIAL_DELAY * Math.pow(2, retryCountRef.current);
            retryCountRef.current++;
            retryTimeoutRef.current = window.setTimeout(connect, delay);
          }
        }
      }
    };

    connect();

    return () => {
      abortControllerRef.current?.abort();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, body, enabled, onMessage, onError]);
};
