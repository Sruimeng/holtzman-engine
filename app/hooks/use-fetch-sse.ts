import { useEffect, useRef } from 'react';
import type { SSEEvent } from '../utils/sse-parser';
import { parseSSEEvent } from '../utils/sse-parser';

interface UseFetchSSEOptions {
  url: string;
  body: unknown;
  onMessage: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  timeout?: number;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;
const META_TIMEOUT = 10_000;
const STREAM_TIMEOUT = 30_000;

export const useFetchSSE = ({
  url,
  body,
  onMessage,
  onError,
  enabled = true,
  timeout = META_TIMEOUT,
}: UseFetchSSEOptions) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<number | undefined>(undefined);
  const timeoutIdRef = useRef<number | undefined>(undefined);
  const streamTimeoutRef = useRef<number | undefined>(undefined);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  onMessageRef.current = onMessage;
  onErrorRef.current = onError;

  // Serialize body for stable dependency
  const bodyJson = body ? JSON.stringify(body) : null;

  useEffect(() => {
    if (!enabled || !bodyJson) return;

    const resetStreamTimeout = () => {
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = window.setTimeout(() => {
        abortControllerRef.current?.abort();
        onErrorRef.current?.(new Error('STREAM_TIMEOUT'));
      }, STREAM_TIMEOUT);
    };

    const connect = async () => {
      abortControllerRef.current = new AbortController();

      timeoutIdRef.current = window.setTimeout(() => {
        abortControllerRef.current?.abort();
        onErrorRef.current?.(new Error('META_TIMEOUT'));
      }, timeout);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyJson,
          signal: abortControllerRef.current.signal,
        });

        clearTimeout(timeoutIdRef.current);

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }

        resetStreamTimeout();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          resetStreamTimeout();

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
                  onMessageRef.current(event);
                  retryCountRef.current = 0;
                }
              } catch {
                // Skip malformed events
              }
            }
          }
        }

        if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
      } catch (err) {
        clearTimeout(timeoutIdRef.current);
        if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);

        if (err instanceof Error && err.name !== 'AbortError') {
          onErrorRef.current?.(err);

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
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (streamTimeoutRef.current) clearTimeout(streamTimeoutRef.current);
    };
  }, [url, bodyJson, enabled, timeout]);
};
