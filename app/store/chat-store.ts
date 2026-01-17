import { create } from '@/store';

type AgentId = string;
type TurnId = string;

interface Message {
  id: string;
  turnId: TurnId;
  agentId: AgentId;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  streamingAgents: Set<AgentId>;
  currentTurnId: TurnId | null;
}

interface ChatActions {
  sendMessage: (content: string) => TurnId;
  appendChunk: (agentId: AgentId, turnId: TurnId, chunk: string) => void;
  finishStream: (agentId: AgentId, turnId: TurnId) => void;
  clearMessages: () => void;
}

type ChatStore = ChatState & ChatActions;

const generateId = () => crypto.randomUUID();

const chatStore = create<ChatState, ChatStore>('chat-store', (initial) => (set, get) => ({
  messages: initial.messages ?? [],
  streamingAgents: initial.streamingAgents ?? new Set(),
  currentTurnId: initial.currentTurnId ?? null,

  sendMessage: (content: string) => {
    const turnId = generateId();
    const userMessage: Message = {
      id: generateId(),
      turnId,
      agentId: 'user',
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    set({
      messages: [...get().messages, userMessage],
      currentTurnId: turnId,
    });

    return turnId;
  },

  appendChunk: (agentId: AgentId, turnId: TurnId, chunk: string) => {
    const { messages, streamingAgents } = get();
    const existing = messages.find(
      (m) => m.turnId === turnId && m.agentId === agentId && m.role === 'assistant',
    );

    if (existing) {
      set({
        messages: messages.map((m) =>
          m.id === existing.id ? { ...m, content: m.content + chunk } : m,
        ),
      });
    } else {
      const newMessage: Message = {
        id: generateId(),
        turnId,
        agentId,
        content: chunk,
        role: 'assistant',
        timestamp: Date.now(),
      };
      set({
        messages: [...messages, newMessage],
        streamingAgents: new Set([...streamingAgents, agentId]),
      });
    }
  },

  finishStream: (agentId: AgentId, _turnId: TurnId) => {
    const { streamingAgents } = get();
    const next = new Set(streamingAgents);
    next.delete(agentId);
    set({ streamingAgents: next });
  },

  clearMessages: () => {
    set({
      messages: [],
      streamingAgents: new Set(),
      currentTurnId: null,
    });
  },
}));

export const { Provider: ChatProvider, useStore: useChatStore } = chatStore;
export type { ChatState, Message };
