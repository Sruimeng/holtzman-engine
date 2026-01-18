import { fetchEventSource } from '@microsoft/fetch-event-source';
import type { PolymathEvent, PolymathRequest } from '@/types/polymath';

const API_URL = 'https://chat.sruim.xin/api/v1/engine';

interface ConnectOptions {
  query: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  onEvent: (event: PolymathEvent) => void;
  onError?: (error: Error) => void;
}

class RetriableError extends Error {}
class FatalError extends Error {}

const buildRequest = (query: string, history: ConnectOptions['history']): PolymathRequest => ({
  mode: 'polymath',
  query,
  history,
});

const handleOpen = async (response: Response) => {
  if (response.ok) return;
  if (response.status >= 400 && response.status < 500) {
    throw new FatalError(`HTTP ${response.status}`);
  }
  throw new RetriableError(`HTTP ${response.status}`);
};

interface SSEMessage {
  event?: string;
  data?: string;
}

const handleMessage = (message: SSEMessage, onEvent: (event: PolymathEvent) => void) => {
  if (!message.event || !message.data) return;

  const data = JSON.parse(message.data);
  const event: PolymathEvent = { type: message.event, ...data } as PolymathEvent;
  onEvent(event);
};

const handleError = (error: Error, onError?: (error: Error) => void) => {
  if (error instanceof FatalError) {
    onError?.(error);
    throw error;
  }
  throw new RetriableError('Connection lost');
};

export async function connectPolymath({ query, history, onEvent, onError }: ConnectOptions) {
  const ctrl = new AbortController();
  const request = buildRequest(query, history);

  await fetchEventSource(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal: ctrl.signal,
    onopen: handleOpen,
    onmessage: (msg) => handleMessage(msg, onEvent),
    onerror: (err) => handleError(err, onError),
  });

  return ctrl;
}
