// SSE Stream Multiplexer - manages concurrent agent streams

type AgentId = string;

interface Chunk {
  agentId: AgentId;
  content: string;
  done: boolean;
}

interface MultiplexerConfig {
  maxConcurrent?: number;
  onChunk: (chunk: Chunk) => void;
  onComplete: (agentId: AgentId) => void;
}

const DEFAULT_MAX_CONCURRENT = 5;

export class Multiplexer {
  private buffers = new Map<AgentId, string>();
  private active = new Set<AgentId>();
  private queue: AgentId[] = [];
  private config: Required<MultiplexerConfig>;

  constructor(config: MultiplexerConfig) {
    this.config = {
      maxConcurrent: DEFAULT_MAX_CONCURRENT,
      ...config,
    };
  }

  push(agentId: AgentId, chunk: string): void {
    if (!this.active.has(agentId)) {
      if (this.active.size >= this.config.maxConcurrent) {
        this.queue.push(agentId);
        return;
      }
      this.active.add(agentId);
      this.buffers.set(agentId, '');
    }

    const buffer = (this.buffers.get(agentId) || '') + chunk;
    this.buffers.set(agentId, buffer);

    this.config.onChunk({
      agentId,
      content: buffer,
      done: false,
    });
  }

  complete(agentId: AgentId): void {
    const content = this.buffers.get(agentId) || '';

    this.config.onChunk({
      agentId,
      content,
      done: true,
    });

    this.buffers.delete(agentId);
    this.active.delete(agentId);
    this.config.onComplete(agentId);

    this.processQueue();
  }

  private processQueue(): void {
    if (this.queue.length === 0) return;
    if (this.active.size >= this.config.maxConcurrent) return;

    const next = this.queue.shift();
    if (next) {
      this.active.add(next);
      this.buffers.set(next, '');
    }
  }

  clear(): void {
    this.buffers.clear();
    this.active.clear();
    this.queue = [];
  }

  get activeCount(): number {
    return this.active.size;
  }

  get queuedCount(): number {
    return this.queue.length;
  }
}
