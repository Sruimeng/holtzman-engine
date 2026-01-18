---
id: strategy-2d-holtzman
type: strategy
created: 2026-01-18
status: draft
---

# Strategy: 2D Holtzman Fallback

## 1. Analysis

**Context:** 3D R3F scene consumes heavy deps (three, @react-three/*). Need pure CSS/Canvas 2D fallback.

**Constitution:** `Ref: style-hemingway` - Iceberg Principle. No fluff.

**Style Protocol:** Strict Adherence. Glass-morphism + Electric Cyan (#38BDF8).

**Negative Constraints:**
- No `new` in render loops
- No inline styles (use UnoCSS)
- No animation libs beyond Framer Motion
- No Canvas context recreation per frame

## 2. Assessment

<Assessment>
**Complexity:** Level 3 (Graphics/Animation)
</Assessment>

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Scene Container                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Layer 0: Background Gradient (CSS)                 │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Layer 1: FakeCore (CSS radial-gradient + animate) │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Layer 2: ParticleField (Canvas 2D)                │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Layer 3: HoloCards (Glass divs + Framer Motion)   │  │
│  ├───────────────────────────────────────────────────┤  │
│  │ Layer 4: UI Overlay (Existing components)         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 4. Math/Algo Specification

<MathSpec>

### 4.1 FakeCore Pulse
```
opacity(t) = 0.4 + 0.2 * sin(t * 2)
scale(t) = 1.0 + 0.05 * sin(t * 3)
```

### 4.2 Particle Orbit (Port from DataTesseracts)
```
FOR each particle p:
  t = elapsed + p.offset
  p.x = p.radius * cos(t * p.speed)
  p.y = p.amplitude * sin(t)
  p.alpha = 0.3 + 0.2 * sin(t * 2)
```

### 4.3 Mouse Parallax (Port from CameraRig)
```
offset.x = mouse.x * parallaxFactor
offset.y = mouse.y * parallaxFactor
lerp(current, target, 0.025)
```

</MathSpec>

## 5. Implementation Plan

<ExecutionPlan>

### Phase A: Background Layer

**Target:** `app/components/stage-2d/fake-core.tsx`

```tsx
// Pseudo-code
interface FakeCoreProps {
  className?: string;
}

// CSS keyframes via UnoCSS
// @keyframes pulse { 0%,100%: opacity 0.4, scale 1; 50%: opacity 0.6, scale 1.05 }

const FakeCore = ({ className }: FakeCoreProps) => (
  <div className={cn(
    "absolute inset-0 flex-center",
    className
  )}>
    <div className={cn(
      "w-120 h-120 rounded-full",
      "bg-radial-[#38BDF8_0%,transparent_70%]",
      "animate-pulse-glow",
      "blur-3xl"
    )} />
  </div>
);
```

**UnoCSS Config Addition:**
```ts
// uno.config.ts
animation: {
  'pulse-glow': 'pulse-glow 4s ease-in-out infinite'
}
```

---

### Phase B: HoloCard Component

**Target:** `app/components/stage-2d/holo-card.tsx`

```tsx
// Replaces AgentMonolith (glass slabs)
interface HoloCardProps {
  children: ReactNode;
  position: 'left' | 'right';
}

// Glass-morphism specs:
// - backdrop-blur-xl
// - bg-white/5
// - border border-white/10
// - shadow-[0_0_30px_rgba(56,189,248,0.1)]

const HoloCard = ({ children, position }: HoloCardProps) => (
  <motion.div
    className={cn(
      "absolute w-64 h-96",
      "backdrop-blur-xl bg-white/5",
      "border border-white/10 rounded-2xl",
      "shadow-[0_0_30px_rgba(56,189,248,0.1)]",
      position === 'left' ? "left-8" : "right-8",
      "top-1/2 -translate-y-1/2"
    )}
    initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
```

---

### Phase C: Particle System

**Target:** `app/components/stage-2d/particle-field.tsx`

```tsx
// Canvas 2D particle system - replaces DataTesseracts
interface Particle {
  offset: number;
  speed: number;
  amplitude: number;
  radius: number;
  size: number;
}

const PARTICLE_COUNT = 40;

// Init once, reuse
const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  offset: Math.random() * 100,
  speed: 0.2 + Math.random() * 0.5,
  amplitude: 100 + Math.random() * 150,
  radius: 150 + Math.random() * 200,
  size: 2 + Math.random() * 3,
}));

// RAF loop
function draw(ctx: CanvasRenderingContext2D, t: number, center: Vec2) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const p of particles) {
    const time = t * 0.001 + p.offset;
    const x = center.x + p.radius * Math.cos(time * p.speed);
    const y = center.y + p.amplitude * Math.sin(time);
    const alpha = 0.3 + 0.2 * Math.sin(time * 2);

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, TAU);
    ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
    ctx.fill();
  }
}
```

---

### Phase D: Scene Refactor

**Target:** `app/components/stage-2d/scene-2d.tsx`

```tsx
// Replaces R3F Canvas
export function Scene2D({ children }: PropsWithChildren) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Parallax handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gray-950"
      onMouseMove={handleMouseMove}
    >
      {/* Layer 0: Gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

      {/* Layer 1: Energy Core */}
      <FakeCore />

      {/* Layer 2: Particles */}
      <ParticleField />

      {/* Layer 3: Cards with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: mouse.x * 20,
          y: mouse.y * 20,
        }}
      >
        <HoloCard position="left" />
        <HoloCard position="right" />
      </motion.div>

      {/* Layer 4: UI */}
      {children}
    </div>
  );
}
```

---

### Phase E: Cleanup

**Dependencies to Remove:**
```json
{
  "@react-three/fiber": "DELETE",
  "@react-three/drei": "DELETE",
  "@react-three/postprocessing": "DELETE",
  "three": "DELETE",
  "@types/three": "DELETE"
}
```

**Files to Delete:**
```
app/components/stage/quantum-sphere.tsx
app/components/stage/agent-monolith.tsx
app/components/stage/data-tesseracts.tsx
app/components/stage/camera-rig.tsx
app/components/stage/advanced-lighting.tsx
app/components/stage/advanced-post-processing.tsx
app/lib/three/shaders/*
```

**Files to Update:**
- Any imports referencing deleted 3D components
- Scene wrapper to use `Scene2D` instead of R3F Canvas

</ExecutionPlan>

## 6. Files to Create/Modify

### Create
| Path | Purpose |
|------|---------|
| `app/components/stage-2d/fake-core.tsx` | CSS energy core |
| `app/components/stage-2d/holo-card.tsx` | Glass card component |
| `app/components/stage-2d/particle-field.tsx` | Canvas 2D particles |
| `app/components/stage-2d/scene-2d.tsx` | Main scene container |
| `app/components/stage-2d/index.ts` | Barrel export |

### Modify
| Path | Change |
|------|--------|
| `uno.config.ts` | Add `pulse-glow` animation |
| `package.json` | Remove three.js deps |

### Delete
| Path | Reason |
|------|--------|
| `app/components/stage/*` | 3D components obsolete |
| `app/lib/three/` | Shader system obsolete |

## 7. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Canvas perf on low-end | Reduce particle count, use `will-change` |
| Glass blur perf | Fallback to solid bg on Safari |
| Motion sickness | Reduce parallax factor |

## 8. Acceptance Criteria

- [ ] No three.js imports remain
- [ ] Bundle size reduced by ~500KB
- [ ] 60fps on mid-tier mobile
- [ ] Visual parity with 3D version (subjective)
- [ ] All existing UI components work unchanged
