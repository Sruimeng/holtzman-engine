---
id: strategy-polymath-chat
type: strategy
related_ids: [style-hemingway, doc-standard, system-overview]
---

# Strategy: Polymath Multi-Agent Chat Integration

## 1. Analysis

**Context:**
- SSE infrastructure EXISTS (stream-client, multiplexer, use-sse-stream)
- Chat-store EXISTS with `messages[]`, `streamingAgents`, `appendChunk()`
- Console uses `useSSEStream()` but route passes empty `onSend`
- HoloCard needs to consume messages from chat-store
- API endpoint: `https://chat.sruim.xin/api/v1/engine`

**Constitution:**
```typescript
// From style-hemingway.md
- Max 20 lines/function
- Max 3 levels nesting
- Early returns over nested if/else
- No "what" comments (WHY only)
- Type definitions > Comments
- Newspaper structure: Types → Constants → Exports → Helpers

// From SPA Constraint
- SSE MUST be client-side only
- Use fetchEventSource for POST-based SSE
```

**Style Protocol:** Strict adherence to `llmdoc/reference/style-hemingway.md` (Iceberg Principle).

**Negative Constraints:**
- 🚫 NO server-side SSE (SPA mode only)
- 🚫 NO `new` keyword in loops
- 🚫 NO deep nesting (>3 levels)
- 🚫 NO "what" comments
- 🚫 NO functions >20 lines

## 2. Assessment

<Assessment>
**Complexity:** Level 3 (Deep)
**Reason:** Multi-agent stream coordination + state synchronization + dynamic UI rendering
</Assessment>

## 3. Math/Algo Specification

<MathSpec>
**Stream Flow:**
```
POST /api/v1/engine { mode: "polymath", query, history }
  ↓
EVENT "meta" → { selected_agents: string[] }
  ↓
FOR EACH selected_agent:
  EVENT "stream" → { agent: string, delta: string }
  ↓ append to messages[agent]
  EVENT "stream_end" → { agent: string }
  ↓
UNTIL all agents complete
```

**State Transformation:**
```typescript
// Before
messages = [{ role: "user", content: "..." }]

// After meta event
streamingAgents = ["critic", "historian", "expander"]
messages = [
  { role: "user", content: "..." },
  { role: "agent", agent: "critic", content: "" },
  { role: "agent", agent: "historian", content: "" },
  { role: "agent", agent: "expander", content: "" }
]

// During stream
delta("critic", "Hello") → messages[1].content += "Hello"
delta("historian", "World") → messages[2].content += "World"

// After stream_end
streamingAgents = streamingAgents.filter(a => a !== "critic")
```

**Agent Rendering:**
```
HoloCard[i].agent = messages[i].agent
HoloCard[i].status = streamingAgents.includes(agent) ? "streaming" : "done"
```
</MathSpec>

## 4. The Plan

<ExecutionPlan>
**Block 1: Extend Chat Store**
1. Add `PolymathMessage` type with `agent?: string` field
2. Add `setStreamingAgents(agents: string[])` action
3. Update `appendChunk(agent: string, delta: string)` to find message by agent
4. Add `finalizeAgent(agent: string)` to remove from streamingAgents

**Block 2: Create Polymath Service**
1. Create `app/lib/services/polymath.ts`
2. Export `connectPolymath({ query, history, onEvent })`
3. Use `fetchEventSource` from `@microsoft/fetch-event-source`
4. Map named events: `meta` → setStreamingAgents, `stream` → appendChunk, `stream_end` → finalizeAgent, `error` → error handler
5. Return abort controller for cleanup

**Block 3: Wire Console Route**
1. Update `packages/studio/app/routes/chat._console/route.tsx`
2. Replace empty `onSend` with Polymath service call
3. Pass `onEvent` callback that dispatches to chat-store
4. Handle cleanup on unmount

**Block 4: Update HoloCard Renderer**
1. Update `packages/studio/app/routes/chat._console/components/holo-card.tsx`
2. Read `message.agent` to determine card type
3. Show spinner if `agent` in `streamingAgents`
4. Apply agent-specific styling (colors/icons)

**Block 5: Type Definitions**
1. Create `app/types/polymath.ts`
2. Define: `PolymathAgent`, `PolymathRequest`, `PolymathEvent`, `PolymathMeta`, `PolymathStream`
3. Export union types for event discrimination
</ExecutionPlan>

## 5. File Targets

| File | Action | Priority |
|------|--------|----------|
| `app/stores/chat-store.ts` | EXTEND | P0 |
| `app/lib/services/polymath.ts` | CREATE | P0 |
| `app/types/polymath.ts` | CREATE | P0 |
| `packages/studio/app/routes/chat._console/route.tsx` | UPDATE | P1 |
| `packages/studio/app/routes/chat._console/components/holo-card.tsx` | UPDATE | P1 |

## 6. Validation Criteria

- [ ] `pnpm typecheck` passes
- [ ] Console sends query → receives `meta` event → renders agent cards
- [ ] Each agent card updates independently during stream
- [ ] All cards show "done" status after stream_end
- [ ] No function exceeds 20 lines
- [ ] No nesting exceeds 3 levels
- [ ] No "what" comments exist
