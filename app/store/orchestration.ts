import { create } from 'zustand';
import type { AgentRole, SSEEvent } from '../utils/sse-parser';

export type AgentStatus = 'thinking' | 'streaming' | 'done' | 'error';
export type OrchestrationStatus = 'idle' | 'orchestrating' | 'streaming' | 'finished' | 'error';

export interface AgentState {
  id: string;
  role: AgentRole;
  status: AgentStatus;
  content: string;
  createdAt: number;
  error?: string;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OrchestrationState {
  status: OrchestrationStatus;
  agents: Record<string, AgentState>;
  history: HistoryMessage[];
  error?: string;
}

interface OrchestrationActions {
  handleSSEEvent: (event: SSEEvent) => void;
  startOrchestration: (query: string) => void;
  addToHistory: (message: HistoryMessage) => void;
  clearHistory: () => void;
  reset: () => void;
}

type Store = OrchestrationState & OrchestrationActions;

const initial: OrchestrationState = {
  status: 'idle',
  agents: {},
  history: [],
};

// Event handlers - each under 10 lines
const handlers = {
  meta: (
    _state: OrchestrationState,
    data: { selected_agents: AgentRole[] },
  ): Partial<OrchestrationState> => {
    const now = Date.now();
    const agents: Record<string, AgentState> = {};

    data.selected_agents.forEach((role) => {
      agents[role] = { id: role, role, status: 'thinking', content: '', createdAt: now };
    });

    return { status: 'streaming', agents };
  },

  stream: (
    state: OrchestrationState,
    data: { agent: AgentRole; delta: string },
  ): Partial<OrchestrationState> => {
    const agent = state.agents[data.agent];
    if (!agent) return {};

    return {
      agents: {
        ...state.agents,
        [data.agent]: { ...agent, status: 'streaming', content: agent.content + data.delta },
      },
    };
  },

  stream_end: (
    state: OrchestrationState,
    data: { agent: AgentRole },
  ): Partial<OrchestrationState> => {
    const agent = state.agents[data.agent];
    if (!agent) return {};

    return {
      agents: { ...state.agents, [data.agent]: { ...agent, status: 'done' } },
    };
  },

  error: (
    state: OrchestrationState,
    data: { agent?: AgentRole; error: string },
  ): Partial<OrchestrationState> => {
    if (!data.agent) {
      return { status: 'error', error: data.error };
    }

    const agent = state.agents[data.agent];
    if (!agent) return { error: data.error };

    return {
      agents: { ...state.agents, [data.agent]: { ...agent, status: 'error', error: data.error } },
    };
  },
};

export const useOrchestrationStore = create<Store>((set) => ({
  ...initial,

  startOrchestration: (query: string) =>
    set((state) => ({
      status: 'orchestrating',
      agents: {},
      error: undefined,
      history: [...state.history, { role: 'user' as const, content: query }],
    })),

  handleSSEEvent: (event) =>
    set((state) => {
      const handler = handlers[event.event];
      return handler ? handler(state, event.data as never) : {};
    }),

  addToHistory: (message: HistoryMessage) =>
    set((state) => ({ history: [...state.history, message] })),

  clearHistory: () => set({ history: [] }),

  reset: () => set({ status: 'idle', agents: {}, error: undefined }),
}));

// Collect synthesizer content as assistant response when all agents are done
export const selectSynthesizerContent = (state: Store): string | null => {
  const synthesizer = state.agents['synthesizer'];
  if (synthesizer?.status === 'done') return synthesizer.content;
  return null;
};

export const selectActiveAgents = (state: Store) =>
  Object.values(state.agents).filter((a) => a.status !== 'done');
