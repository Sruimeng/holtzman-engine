---
id: strategy-nexus-boardroom
type: strategy
related_ids: [constitution, style-hemingway, tech-stack]
---

# Strategy: Nexus Boardroom

## 1. Analysis

**Context:**
- Base: Holtzman Engine (React 19 + RR7 + Zustand + UnoCSS)
- Missing: R3F ecosystem, Dexie.js, Framer Motion, TanStack Query
- Reusable: Store factory, color system, layout components, hooks

**Constitution:** Ref: `constitution`
- React 19 + TypeScript strict
- Zustand for state (no derived state in store)
- File naming: kebab-case
- Component naming: PascalCase
- No `any`, no hardcoded values

**Style Protocol:** Strict Adherence to `llmdoc/reference/style-hemingway.md`
- Iceberg Principle: Show 10%, imply 90%
- Max 20 lines/function, 3 levels nesting
- Types > Comments
- Early returns, flatten conditionals

**Negative Constraints:**
- No `new` in render loops
- No `any` types
- No "what" comments
- No deep nesting (>3 levels)
- No unused parameters
- No `AbstractManagerImpl` naming

## 2. Assessment

<Assessment>
**Complexity:** Level 3

Rationale:
- 3D Stage System requires math (quaternions, orbital mechanics)
- Real-time particle systems need GPU optimization
- SSE streaming with concurrent channels
</Assessment>

## 3. Math/Algo Specification

<MathSpec>

### 3.1 Quantum Core Particle System

```
// Particle orbit on sphere surface
P(t) = Center + R * [
  sin(theta) * cos(phi + omega*t),
  sin(theta) * sin(phi + omega*t),
  cos(theta)
]

where:
  theta = random(0, PI)      // polar angle
  phi = random(0, 2*PI)      // azimuthal angle
  omega = baseSpeed * (1 + noise)
  R = coreRadius * (1 + pulse * sin(pulseFreq * t))
```

### 3.2 Agent Monolith Orbital Placement

```
// N agents on circular orbit
Position(i, N) = [
  orbitRadius * cos(2*PI*i/N + globalRotation),
  0,
  orbitRadius * sin(2*PI*i/N + globalRotation)
]

// Focus animation (selected agent)
LerpPosition(current, target, dt) = current + (target - current) * (1 - e^(-smoothing * dt))
```

### 3.3 Camera Rig

```
// Orbit camera
Eye = Target + [
  distance * sin(azimuth) * cos(elevation),
  distance * sin(elevation),
  distance * cos(azimuth) * cos(elevation)
]

// Smooth follow
azimuth += (targetAzimuth - azimuth) * damping * dt
elevation = clamp(elevation, minElev, maxElev)
distance = clamp(distance, minDist, maxDist)
```

### 3.4 Performance Degradation Tiers

```
Tier = f(FPS, GPU_Load)

if FPS < 30:
  Tier = LOW
  particleCount = 100
  shadowsEnabled = false
  postProcessing = false
elif FPS < 50:
  Tier = MEDIUM
  particleCount = 500
  shadowsEnabled = true
  postProcessing = false
else:
  Tier = HIGH
  particleCount = 2000
  shadowsEnabled = true
  postProcessing = true
```

### 3.5 SSE Stream Multiplexer

```
// Concurrent channel management
Channels: Map<AgentID, ReadableStream>

onMessage(agentId, chunk):
  buffer[agentId] += chunk
  if isComplete(buffer[agentId]):
    emit(agentId, parse(buffer[agentId]))
    buffer[agentId] = ''

// Backpressure handling
if channels.size > MAX_CONCURRENT:
  queue.push(newRequest)
  await channels.race()
```

</MathSpec>

## 4. The Plan

<ExecutionPlan>

**Phase 0: Foundation (Day 1)**
1. Install deps: `@react-three/fiber`, `@react-three/drei`, `three`, `framer-motion`, `dexie`, `@tanstack/react-query`
2. Create `app/lib/three/` directory structure
3. Create `app/lib/dexie/` for IndexedDB schema
4. Add R3F types to tsconfig

**Phase 1: Auth Module (Day 2-3)**
1. Create `app/routes/auth/` with split-screen layout
2. Left panel: Form (Magic Link flow)
3. Right panel: 3D canvas placeholder
4. Wire to `auth.sruim.xin` with `credentials: 'include'`
5. Store auth state in Zustand (transient) + cookie (persistent)

**Phase 2: Core 3D Infrastructure (Day 4-6)**
1. Create `app/components/stage/quantum-core.tsx`
   - InstancedMesh for particles
   - Shader material for glow effect
2. Create `app/components/stage/agent-monolith.tsx`
   - Geometry: BoxGeometry with bevel
   - Material: MeshStandardMaterial + emissive
3. Create `app/components/stage/orbit-system.tsx`
   - Ring geometry for orbit path
   - Animation loop for rotation
4. Create `app/components/stage/camera-rig.tsx`
   - OrbitControls wrapper
   - Smooth transitions on agent select
5. Implement 3-tier degradation in `app/hooks/use-performance-tier.ts`

**Phase 3: Main HUD Shell (Day 7-8)**
1. Create `app/routes/boardroom/` layout
2. Sidebar: Agent list + God Mode toggle
3. Top nav: Breadcrumb + user menu
4. Bottom console: Collapsible chat input
5. Center: R3F Canvas with Stage

**Phase 4: Chat Engine (Day 9-11)**
1. Create `app/lib/sse/stream-client.ts`
   - EventSource wrapper
   - Reconnection logic
2. Create `app/store/chat-store.ts`
   - Messages per agent
   - Streaming state
3. Create `app/components/chat/message-stream.tsx`
   - Token-by-token render
   - Markdown support
4. Implement multiplexer for concurrent agent streams

**Phase 5: God Mode Panel (Day 12-13)**
1. Create `app/components/god-mode/config-panel.tsx`
2. Sections: Model select, Temperature, System prompt
3. Persist to Dexie.js
4. Sync with TanStack Query for cache invalidation

**Phase 6: I18n + Theme (Day 14)**
1. Extend existing i18n with boardroom namespace
2. Add cyber-dark theme variant
3. Frosted glass utilities in UnoCSS

**Phase 7: Polish + Optimization (Day 15-16)**
1. Lighthouse audit
2. Bundle analysis
3. Lazy load 3D components
4. Preload critical assets

</ExecutionPlan>

## 5. File Structure Preview

```
app/
  routes/
    auth/
      route.tsx           # Split-screen auth
    boardroom/
      route.tsx           # Main HUD layout
      _index/route.tsx    # Default view
  components/
    stage/
      quantum-core.tsx    # Particle system
      agent-monolith.tsx  # Agent 3D representation
      orbit-system.tsx    # Orbital ring
      camera-rig.tsx      # Camera controller
      scene.tsx           # Composition root
    chat/
      message-stream.tsx  # SSE message renderer
      input-console.tsx   # Bottom input bar
    god-mode/
      config-panel.tsx    # Settings drawer
  lib/
    three/
      shaders/            # GLSL shaders
      materials.ts        # Custom materials
      geometries.ts       # Reusable geometries
    sse/
      stream-client.ts    # EventSource wrapper
      multiplexer.ts      # Concurrent streams
    dexie/
      db.ts               # Database schema
      hooks.ts            # useLiveQuery wrappers
  store/
    chat-store.ts         # Chat state
    stage-store.ts        # 3D scene state
    god-mode-store.ts     # Config state
  hooks/
    use-performance-tier.ts
    use-sse-stream.ts
```

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| R3F bundle size | Tree-shake drei, lazy load |
| Mobile 3D perf | Aggressive tier degradation |
| SSE reconnection | Exponential backoff + queue |
| IndexedDB quota | LRU eviction policy |

## 7. Success Criteria

- [ ] Auth flow < 3s to dashboard
- [ ] 3D scene 60fps on tier HIGH
- [ ] 3D scene 30fps on tier LOW
- [ ] SSE latency < 100ms first token
- [ ] Lighthouse perf > 80
