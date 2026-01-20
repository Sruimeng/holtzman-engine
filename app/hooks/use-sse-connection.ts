import { useEffect, useRef } from 'react';
import type { SSEEvent } from '../utils/sse-parser';
import { parseSSEEvent } from '../utils/sse-parser';

interface UseSSEConnectionOptions {
  url: string;
  onMessage: (event: SSEEvent) => void;
  onError?: (error: Event) => void;
  enabled?: boolean;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;
const EVENT_TYPES = ['meta', 'stream', 'stream_end', 'error'] as const;

export const useSSEConnection = ({
  url,
  onMessage,
  onError,
  enabled = true,
}: UseSSEConnectionOptions) => {
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(url);

      // Named events require explicit listeners
      EVENT_TYPES.forEach((eventType) => {
        eventSource?.addEventListener(eventType, (e: MessageEvent) => {
          const event = parseSSEEvent(eventType, e.data);
          if (event) {
            onMessage(event);
            retryCountRef.current = 0;
          }
        });
      });

      eventSource.onerror = (e) => {
        eventSource?.close();
        onError?.(e);

        if (retryCountRef.current < MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, retryCountRef.current);
          retryCountRef.current++;
          retryTimeoutRef.current = window.setTimeout(connect, delay);
        }
      };
    };

    connect();

    return () => {
      eventSource?.close();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [url, enabled, onMessage, onError]);
};
