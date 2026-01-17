// SSE Stream Client with auto-reconnect and resume

type EventType = 'orchestration' | 'stream' | 'done' | 'error';

interface SSEEvent {
  type: EventType;
  agentId: string;
  data: string;
  id?: string;
}

interface StreamClientConfig {
  url: string;
  onMessage: (event: SSEEvent) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  maxRetries?: number;
}

const INITIAL_RETRY_MS = 1000;
const MAX_RETRY_MS = 30000;

export class StreamClient {
  private es: EventSource | null = null;
  private lastEventId: string | null = null;
  private retryCount = 0;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;
  private config: Required<StreamClientConfig>;

  constructor(config: StreamClientConfig) {
    this.config = {
      maxRetries: 10,
      onError: () => {},
      onConnect: () => {},
      ...config,
    };
  }

  connect(): void {
    this.cleanup();

    const url = new URL(this.config.url);
    if (this.lastEventId) {
      url.searchParams.set('lastEventId', this.lastEventId);
    }

    this.es = new EventSource(url.toString());
    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.es) return;

    this.es.onopen = () => {
      this.retryCount = 0;
      this.config.onConnect();
    };

    this.es.onerror = () => {
      this.scheduleReconnect();
    };

    const eventTypes: EventType[] = ['orchestration', 'stream', 'done', 'error'];
    eventTypes.forEach((type) => {
      this.es!.addEventListener(type, (e: MessageEvent) => {
        const event = this.parseEvent(type, e);
        if (event.id) this.lastEventId = event.id;
        this.config.onMessage(event);
      });
    });
  }

  private parseEvent(type: EventType, e: MessageEvent): SSEEvent {
    try {
      const parsed = JSON.parse(e.data);
      return { type, id: e.lastEventId, ...parsed };
    } catch {
      return { type, agentId: '', data: e.data, id: e.lastEventId };
    }
  }

  private scheduleReconnect(): void {
    this.cleanup();

    if (this.retryCount >= this.config.maxRetries) {
      this.config.onError(new Error('Max retries exceeded'));
      return;
    }

    const delay = Math.min(INITIAL_RETRY_MS * Math.pow(2, this.retryCount), MAX_RETRY_MS);

    this.retryTimeout = setTimeout(() => {
      this.retryCount++;
      this.connect();
    }, delay);
  }

  private cleanup(): void {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  disconnect(): void {
    this.cleanup();
    this.lastEventId = null;
    this.retryCount = 0;
  }

  get connected(): boolean {
    return this.es?.readyState === EventSource.OPEN;
  }
}
