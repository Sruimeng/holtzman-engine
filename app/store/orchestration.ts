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

export interface Round {
  id: string;
  query: string;
  agents: Record<string, AgentState>;
  createdAt: number;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OrchestrationState {
  status: OrchestrationStatus;
  rounds: Round[];
  currentRoundId: string | null;
  history: HistoryMessage[];
  cardCollapsed: Record<string, boolean>;
  error?: string;
}

interface OrchestrationActions {
  handleSSEEvent: (event: SSEEvent) => void;
  startOrchestration: (query: string) => void;
  addToHistory: (message: HistoryMessage) => void;
  setHistory: (history: HistoryMessage[]) => void;
  setRounds: (rounds: Round[]) => void;
  setCardCollapsed: (agentId: string, collapsed: boolean) => void;
  setAllCardsCollapsed: (collapsed: boolean) => void;
  clearHistory: () => void;
  reset: () => void;
}

type Store = OrchestrationState & OrchestrationActions;

const initial: OrchestrationState = {
  status: 'idle',
  rounds: [],
  currentRoundId: null,
  history: [],
  cardCollapsed: {},
};

// Helper to get current round
const getCurrentRound = (state: OrchestrationState): Round | undefined =>
  state.rounds.find((r) => r.id === state.currentRoundId);

// Helper to update current round's agents
const updateCurrentRoundAgents = (
  state: OrchestrationState,
  updater: (agents: Record<string, AgentState>) => Record<string, AgentState>,
): Round[] => {
  return state.rounds.map((r) =>
    r.id === state.currentRoundId ? { ...r, agents: updater(r.agents) } : r,
  );
};

// Event handlers
const handlers = {
  meta: (
    state: OrchestrationState,
    data: { selected_agents: AgentRole[] },
  ): Partial<OrchestrationState> => {
    const now = Date.now();
    const agents: Record<string, AgentState> = {};

    data.selected_agents.forEach((role) => {
      agents[role] = { id: role, role, status: 'thinking', content: '', createdAt: now };
    });

    const rounds = state.rounds.map((r) => (r.id === state.currentRoundId ? { ...r, agents } : r));

    return { status: 'streaming', rounds };
  },

  stream: (
    state: OrchestrationState,
    data: { agent: AgentRole; delta: string },
  ): Partial<OrchestrationState> => {
    const round = getCurrentRound(state);
    const agent = round?.agents[data.agent];
    if (!agent) return {};

    const rounds = updateCurrentRoundAgents(state, (agents) => ({
      ...agents,
      [data.agent]: { ...agent, status: 'streaming', content: agent.content + data.delta },
    }));

    return { rounds };
  },

  stream_end: (
    state: OrchestrationState,
    data: { agent: AgentRole },
  ): Partial<OrchestrationState> => {
    const round = getCurrentRound(state);
    const agent = round?.agents[data.agent];
    if (!agent) return {};

    const rounds = updateCurrentRoundAgents(state, (agents) => ({
      ...agents,
      [data.agent]: { ...agent, status: 'done' },
    }));

    const updatedRound = rounds.find((r) => r.id === state.currentRoundId);
    const allDone = updatedRound
      ? Object.values(updatedRound.agents).every((a) => a.status === 'done' || a.status === 'error')
      : false;

    return {
      rounds,
      status: allDone ? 'finished' : state.status,
    };
  },

  error: (
    state: OrchestrationState,
    data: { agent?: AgentRole; error: string },
  ): Partial<OrchestrationState> => {
    if (!data.agent) {
      return { status: 'error', error: data.error };
    }

    const round = getCurrentRound(state);
    const agent = round?.agents[data.agent];
    if (!agent) return { error: data.error };

    const rounds = updateCurrentRoundAgents(state, (agents) => ({
      ...agents,
      [data.agent!]: { ...agent, status: 'error', error: data.error },
    }));

    return { rounds };
  },
};

export const useOrchestrationStore = create<Store>((set) => ({
  ...initial,

  startOrchestration: (query: string) =>
    set((state) => {
      const roundId = crypto.randomUUID();
      const newRound: Round = {
        id: roundId,
        query,
        agents: {},
        createdAt: Date.now(),
      };
      return {
        status: 'orchestrating',
        rounds: [...state.rounds, newRound],
        currentRoundId: roundId,
        error: undefined,
        history: [...state.history, { role: 'user' as const, content: query }],
      };
    }),

  handleSSEEvent: (event) =>
    set((state) => {
      const handler = handlers[event.event];
      return handler ? handler(state, event.data as never) : {};
    }),

  addToHistory: (message: HistoryMessage) =>
    set((state) => ({ history: [...state.history, message] })),

  setHistory: (history: HistoryMessage[]) => set({ history }),

  setRounds: (rounds: Round[]) => {
    const collapsedMap: Record<string, boolean> = {};
    rounds.forEach((r) => {
      Object.keys(r.agents).forEach((agentId) => {
        collapsedMap[`${r.id}-${agentId}`] = true;
      });
    });
    set({ rounds, cardCollapsed: collapsedMap, status: rounds.length > 0 ? 'finished' : 'idle' });
  },

  setCardCollapsed: (agentId: string, collapsed: boolean) =>
    set((state) => ({ cardCollapsed: { ...state.cardCollapsed, [agentId]: collapsed } })),

  setAllCardsCollapsed: (collapsed: boolean) =>
    set((state) => {
      const newCollapsed: Record<string, boolean> = {};
      Object.keys(state.cardCollapsed).forEach((id) => {
        newCollapsed[id] = collapsed;
      });
      return { cardCollapsed: newCollapsed };
    }),

  clearHistory: () => set({ history: [], rounds: [], currentRoundId: null, cardCollapsed: {} }),

  reset: () => set({ ...initial }),
}));

// Collect synthesizer content from current round
export const selectSynthesizerContent = (state: Store): string | null => {
  const currentRound = state.rounds.find((r) => r.id === state.currentRoundId);
  const synthesizer = currentRound?.agents['synthesizer'];
  if (synthesizer?.status === 'done') return synthesizer.content;
  return null;
};

// Get all agents from all rounds for display
export const selectAllAgents = (state: Store): AgentState[] =>
  state.rounds.flatMap((r) => Object.values(r.agents));

// Get rounds
export const selectRounds = (state: Store): Round[] => state.rounds;
