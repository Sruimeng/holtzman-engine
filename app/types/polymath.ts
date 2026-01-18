export type PolymathAgent = 'critic' | 'historian' | 'expander' | 'pragmatist';

export interface PolymathRequest {
  mode: 'polymath';
  query: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PolymathMetaEvent {
  type: 'meta';
  selected_agents: PolymathAgent[];
}

export interface PolymathStreamEvent {
  type: 'stream';
  agent: PolymathAgent;
  delta: string;
}

export interface PolymathStreamEndEvent {
  type: 'stream_end';
  agent: PolymathAgent;
}

export interface PolymathErrorEvent {
  type: 'error';
  message: string;
}

export type PolymathEvent =
  | PolymathMetaEvent
  | PolymathStreamEvent
  | PolymathStreamEndEvent
  | PolymathErrorEvent;
