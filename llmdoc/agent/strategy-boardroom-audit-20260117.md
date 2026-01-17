---
id: strategy-boardroom-audit-20260117
type: strategy
related_ids: [prd, tech, ui]
---

# Mission Analysis: Boardroom SSE Integration

## 1. Analysis

**Context**: Investigator reports 100% implementation complete. No TODOs detected.

**Constitution**:
- `Ref: tech.md` - Dual-Loop Architecture, 2D/3D Projection, SSE Resilience
- `Ref: prd.md` - Cyber-Minimalism, Monolith System, Concurrent Agent Streams
- `Ref: style-hemingway.md` - Iceberg Principle, Max Nesting ≤3, Max Function ≤20 lines

**Style Protocol**: Strict adherence to Hemingway. No meta-talk. Type-First. Early returns.

**Negative Constraints**:
🚫 DO NOT remount 3D scene on message updates
🚫 DO NOT use React state for coordinate updates
🚫 DO NOT add "what" comments
🚫 DO NOT exceed 3 levels of nesting

## 2. Assessment

<Assessment>
**Complexity**: Level 3 (Graphics/SSE/State Sync)
**Mission Type**: Code Audit + Gap Analysis
**Risk**: Implementation exists but constitution compliance unknown
</Assessment>

## 3. Math/Algo Specification

<MathSpec>
**2D/3D Projection (From tech.md)**:
```
WorldPos = Monolith.position (Vector3)
NDC = Camera.project(WorldPos)
ScreenX = (NDC.x + 1) / 2 * ViewportWidth
ScreenY = (-NDC.y + 1) / 2 * ViewportHeight
```

**SSE Reconnection (Exponential Backoff)**:
```
Delay(n) = min(InitialDelay * 2^n, MaxDelay)
where InitialDelay = 1000ms, MaxDelay = 30000ms
```

**State Routing**:
```
IF StateType = Transient THEN
  Zustand.getState() -> Direct DOM mutation
ELSE IF StateType = Persistent THEN
  IndexedDB -> React Context -> Re-render
```
</MathSpec>

## 4. The Plan

<ExecutionPlan>
**Block 1: Constitution Compliance Audit**
1. READ `app/components/stage/scene.tsx`
   - VERIFY: No React state for frame-by-frame updates
   - VERIFY: Uses `useFrame` for 60fps loop
2. READ `app/lib/sse/stream-client.ts`
   - VERIFY: Exponential backoff implemented
   - VERIFY: Last-Event-ID header for resumption
3. READ all component files
   - CHECK: Nesting depth ≤3
   - CHECK: Function length ≤20 lines
   - CHECK: Comment ratio <10%

**Block 2: Critical Gap Detection**
1. CHECK: 2D/3D Tracker implementation
   - REQUIRED: `camera.project()` + Direct DOM manipulation
   - FALLBACK: If missing, flag as Level 3 enhancement
2. CHECK: InstancedMesh for orbit objects
   - VERIFY: Shared geometry, `setMatrixAt()` usage
3. CHECK: Performance tier system
   - VERIFY: FPS-based degradation (High/Medium/Low)

**Block 3: Style Violations**
1. GREP: "// This function", "// Loop through"
2. GREP: `else { return false }` patterns
3. GREP: Deep nesting (`if.*{.*if.*{.*if`)
4. OUTPUT: List of violations with file:line references

**Block 4: Strategic Recommendation**
IF GapCount = 0 AND ViolationCount < 5 THEN
  Status = "APPROVED - Production Ready"
ELSE IF CriticalGaps > 0 THEN
  Status = "BLOCKED - Requires Worker dispatch"
  Output = Enhanced strategy with pseudo-code
ELSE
  Status = "MINOR CLEANUP - Critic dispatch"
</ExecutionPlan>

## 5. Compliance Checklist

- [x] Hemingway Style cited
- [x] MathSpec provided (2D/3D, SSE, State)
- [x] Execution plan is terse (<20 lines per block)
- [x] No "what" comments in this document
- [x] Early return logic in plan
- [x] Type-First approach (Assessment/MathSpec blocks)

## 6. Critical Constraints

**From tech.md**:
- Transient state (mouse, camera lerp) → Zustand only
- Persistent state (messages, config) → IndexedDB → React
- Bridge: Custom Events / Zustand Actions trigger local 3D updates

**From prd.md**:
- Agent Monoliths expand when active, collapse when idle
- SSE multiplexing: Support 5 concurrent agent streams
- UI must survive WebGL context loss (mobile background)

**Performance Budget**:
- High Tier: 60fps, all effects
- Medium: 45fps, disable caustics/dispersion
- Low: 30fps, disable post-processing, dpr=1
