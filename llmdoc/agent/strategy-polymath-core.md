---
id: strategy-polymath-core
type: strategy
related_ids: [constitution, style-hemingway, tech-stack, system-overview]
---

# Strategy: Polymath Core - Multi-Agent SSE Orchestration

## 1. Analysis

### Context
Build a real-time multi-agent orchestration UI that streams SSE events from backend, manages concurrent agent states via Zustand, and renders dynamic agent cards with role-based theming.

### Constitution
**Ref: `constitution.md`**
- State Management: Zustand (Record-based, no locks)
- Styling: UnoCSS (atomic CSS)
- Type System: TypeScript (no `any`)
- Routing: React Router v7 (SPA mode)
- HTTP: ofetch

**Ref: `tech-stack.md`**
- React 19.0.0
- Zustand 5.0.3
- Vite 7.3.1
- i18next (7 languages)

### Style Protocol
**STRICT ADHERENCE to `style-hemingway.md`:**
- Early returns (flatten conditionals)
- No "what" comments
- Type definitions > Comments
- Max nesting: 3 levels
- Max function length: 20 lines
- Newspaper structure (types first, then logic)

### Negative Constraints
- No `new` in loops
- No `any` types
- No direct API calls in components (use hooks)
- No nested ternaries (>2 levels)
- No state mutations outside Zustand actions
- No inline styles (use UnoCSS classes)
- No hardcoded strings (use i18n keys)

## 2. Assessment

<Assessment>
**Complexity:** Level 2 (UI/State/SSE)
**Rationale:**
- SSE connection management (reconnect logic)
- Concurrent state updates (Record-based store)
- Dynamic UI rendering (agent cards)
- State machine transitions (idle -> orchestrating -> streaming -> finished)
</Assessment>

## 3. Data Flow Specification

<MathSpec>
### SSE Event Stream
```
EventSource -> onMessage -> parseEvent -> dispatch(action) -> Zustand.update
```

### State Machine
```
State = idle | orchestrating | streaming | finished | error

Transitions:
  idle + START_ORCHESTRATION -> orchestrating
  orchestrating + AGENT_CREATED -> streaming
  streaming + AGENT_FINISHED -> (all done?) finished : streaming
  * + ERROR -> error
```

### Concurrent Update (Lock-Free)
```
Store = Record<AgentId, AgentState>

Update(agentId, delta):
  store[agentId] = { ...store[agentId], ...delta }
  // No mutex needed - React batches updates
```

### Agent Card Rendering
```
AgentCards = Object.entries(store)
  .filter(([_, agent]) => agent.visible)
  .sort((a, b) => a.createdAt - b.createdAt)
  .map(([id, agent]) => <AgentCard key={id} {...agent} />)
```
</MathSpec>

## 4. Type Definitions

<TypeSpec>
```typescript
// Core Types
type AgentRole = 'investigator' | 'librarian' | 'scout' | 'worker' | 'critic' | 'recorder';
type AgentStatus = 'idle' | 'thinking' | 'streaming' | 'finished' | 'error';
type OrchestrationStatus = 'idle' | 'orchestrating' | 'streaming' | 'finished' | 'error';

interface AgentState {
  id: string;
  role: AgentRole;
  status: AgentStatus;
  content: string;
  createdAt: number;
  updatedAt: number;
  error?: string;
}

interface OrchestrationState {
  status: OrchestrationStatus;
  agents: Record<string, AgentState>;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
}

// SSE Event Types
interface SSEEvent {
  type: 'agent.created' | 'agent.chunk' | 'agent.finished' | 'orchestration.finished' | 'error';
  data: unknown;
}

interface AgentCreatedEvent {
  agentId: string;
  role: AgentRole;
  timestamp: number;
}

interface AgentChunkEvent {
  agentId: string;
  chunk: string;
  timestamp: number;
}

interface AgentFinishedEvent {
  agentId: string;
  timestamp: number;
}

// Store Actions
interface OrchestrationStore extends OrchestrationState {
  startOrchestration: (query: string) => Promise<void>;
  handleSSEEvent: (event: SSEEvent) => void;
  reset: () => void;
}
```
</TypeSpec>

## 5. File Structure

<FileStructure>
```
app/
├── routes/
│   └── polymath/
│       ├── route.tsx                    # Main orchestration page
│       └── components/
│           ├── agent-card.tsx           # Single agent card
│           ├── agent-grid.tsx           # Grid layout
│           ├── orchestration-panel.tsx  # Control panel
│           └── status-indicator.tsx     # Status badge
├── store/
│   └── orchestration.ts                 # Zustand store
├── hooks/
│   ├── use-sse-connection.ts            # SSE connection manager
│   └── use-orchestration.ts             # Orchestration facade
├── utils/
│   ├── sse-parser.ts                    # Parse SSE events
│   └── agent-theme.ts                   # Role -> theme mapping
└── constants/
    └── static/
        └── agent-roles.ts               # Agent role definitions
```
</FileStructure>

## 6. The Plan

<ExecutionPlan>

### Phase 1 (P0): Core Infrastructure
**Goal:** SSE connection + Zustand store + basic rendering

**Block 1.1: SSE Connection Manager**
1. Create `use-sse-connection.ts`
   - `useSSEConnection(url: string, onMessage: (event: SSEEvent) => void)`
   - Auto-reconnect on disconnect (exponential backoff)
   - Cleanup on unmount
2. Create `sse-parser.ts`
   - `parseSSEEvent(raw: string): SSEEvent`
   - Validate event schema with Zod

**Block 1.2: Zustand Store**
1. Create `orchestration.ts`
   - Initial state: `{ status: 'idle', agents: {} }`
   - Actions:
     - `startOrchestration(query: string)`
     - `handleSSEEvent(event: SSEEvent)`
     - `reset()`
   - Selectors:
     - `selectAgentsByRole(role: AgentRole)`
     - `selectActiveAgents()`

**Block 1.3: Basic Components**
1. Create `agent-card.tsx`
   - Props: `AgentState`
   - Display: role badge, status, content (streaming)
   - Styling: UnoCSS (card, shadow, border)
2. Create `agent-grid.tsx`
   - Props: `agents: Record<string, AgentState>`
   - Layout: CSS Grid (responsive, 1-3 columns)
3. Create `route.tsx`
   - Wire SSE -> Store -> UI
   - Input field + "Start" button

**Verification:**
- SSE events update store
- Agent cards render in real-time
- No memory leaks on unmount

---

### Phase 2 (P1): Role Theming + Layout
**Goal:** Visual differentiation + dynamic grid

**Block 2.1: Agent Theme Mapping**
1. Create `agent-roles.ts`
   ```typescript
   const AGENT_THEMES: Record<AgentRole, { color: string; icon: string }> = {
     investigator: { color: 'blue', icon: 'carbon:search' },
     librarian: { color: 'purple', icon: 'carbon:book' },
     scout: { color: 'green', icon: 'carbon:map' },
     worker: { color: 'orange', icon: 'carbon:tool-box' },
     critic: { color: 'red', icon: 'carbon:warning' },
     recorder: { color: 'gray', icon: 'carbon:document' },
   };
   ```
2. Create `agent-theme.ts`
   - `getAgentTheme(role: AgentRole): { color, icon }`

**Block 2.2: Enhanced Agent Card**
1. Update `agent-card.tsx`
   - Add role icon (via `@iconify-json/carbon`)
   - Add role-based border color
   - Add status indicator (pulsing dot for "streaming")
2. Create `status-indicator.tsx`
   - Props: `status: AgentStatus`
   - Render: colored dot + label

**Block 2.3: Dynamic Grid Layout**
1. Update `agent-grid.tsx`
   - Auto-adjust columns based on agent count
   - Smooth transitions (CSS `transition`)

**Verification:**
- Each role has distinct color/icon
- Grid adapts to 1-6 agents
- Status indicators update in real-time

---

### Phase 3 (P2): Advanced Features
**Goal:** History + config + error recovery

**Block 3.1: Orchestration Panel**
1. Create `orchestration-panel.tsx`
   - Query input (textarea)
   - Start/Stop buttons
   - Status display (orchestration-level)
   - History dropdown (last 5 queries)

**Block 3.2: Error Handling**
1. Update `use-sse-connection.ts`
   - Retry logic (max 3 attempts)
   - Error event dispatch
2. Update `orchestration.ts`
   - `handleError(error: string)`
   - Store error state per agent
3. Update `agent-card.tsx`
   - Display error message (red banner)

**Block 3.3: History Context**
1. Create `use-orchestration-history.ts`
   - Store last N queries in localStorage
   - `addQuery(query: string)`
   - `getHistory(): string[]`
2. Update `orchestration-panel.tsx`
   - Load history on mount
   - Click to re-run query

**Verification:**
- SSE reconnects on network failure
- Errors display in agent cards
- History persists across sessions

</ExecutionPlan>

## 7. Testing Strategy

<TestingPlan>

### Unit Tests
1. `sse-parser.ts`
   - Valid event parsing
   - Invalid event handling
2. `agent-theme.ts`
   - All roles have themes
   - Unknown role fallback

### Integration Tests
1. `orchestration.ts`
   - State transitions (idle -> orchestrating -> finished)
   - Concurrent agent updates
   - Error state handling

### E2E Tests (Manual)
1. Start orchestration
2. Verify SSE connection
3. Check agent cards render
4. Simulate network failure
5. Verify reconnect

</TestingPlan>

## 8. Implementation Notes

### SSE Connection Pattern
```typescript
// use-sse-connection.ts
export const useSSEConnection = (url: string, onMessage: (event: SSEEvent) => void) => {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (e) => {
      const event = parseSSEEvent(e.data);
      if (event) onMessage(event);
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Exponential backoff retry
    };

    return () => eventSource.close();
  }, [url, onMessage]);
};
```

### Zustand Store Pattern
```typescript
// orchestration.ts
export const useOrchestrationStore = create<OrchestrationStore>((set) => ({
  status: 'idle',
  agents: {},

  handleSSEEvent: (event) => set((state) => {
    if (event.type === 'agent.chunk') {
      const { agentId, chunk } = event.data;
      return {
        agents: {
          ...state.agents,
          [agentId]: {
            ...state.agents[agentId],
            content: state.agents[agentId].content + chunk,
            updatedAt: Date.now(),
          },
        },
      };
    }
    // Handle other event types...
  }),
}));
```

### Agent Card Pattern
```typescript
// agent-card.tsx
export const AgentCard = ({ id, role, status, content }: AgentState) => {
  const theme = getAgentTheme(role);

  return (
    <div className={`card border-l-4 border-${theme.color}-500`}>
      <div className="flex items-center gap-2">
        <Icon icon={theme.icon} className={`text-${theme.color}-500`} />
        <span className="font-bold">{role}</span>
        <StatusIndicator status={status} />
      </div>
      <div className="mt-4 whitespace-pre-wrap">{content}</div>
    </div>
  );
};
```

## 9. Rollout Checklist

- [ ] Phase 1.1: SSE connection manager
- [ ] Phase 1.2: Zustand store
- [ ] Phase 1.3: Basic components
- [ ] Phase 2.1: Agent theme mapping
- [ ] Phase 2.2: Enhanced agent card
- [ ] Phase 2.3: Dynamic grid layout
- [ ] Phase 3.1: Orchestration panel
- [ ] Phase 3.2: Error handling
- [ ] Phase 3.3: History context
- [ ] Integration testing
- [ ] Documentation update

## 10. References

- Constitution: `llmdoc/reference/constitution.md`
- Style Guide: `llmdoc/reference/style-hemingway.md`
- Tech Stack: `llmdoc/reference/tech-stack.md`
- System Overview: `llmdoc/architecture/system-overview.md`
