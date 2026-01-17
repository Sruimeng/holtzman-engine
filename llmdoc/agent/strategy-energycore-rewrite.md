---
id: strategy-energycore-rewrite
type: strategy
priority: high
target: app/components/stage/quantum-sphere.tsx
created: 2026-01-17
---

# Strategy: EnergyCore Rewrite

## 1. Analysis

**Context:**
- Current `QuantumSphere` has 4 layers but no additive blending, weak visual hierarchy.
- No performance tier adaptation (always renders at full complexity).
- No rotation animation logic for orbital rings.
- Material spec does not follow constitution standards (transmission, thickness, roughness).

**Constitution:**
- **Ref:** `Ref: style-hemingway` - Iceberg Principle, Early Returns, Max 3-level nesting.
- **Ref:** `Ref: tech#dual-loop-architecture` - Transient animation state MUST use Zustand (outside React), NO `useState` inside `useFrame`.
- **Ref:** `Ref: tech#performance-budget` - Dynamic tier system (High/Medium/Low) based on FPS.
- **Ref:** `use-performance-tier.ts` - Already implements 3-tier config system.

**Style Protocol:**
- Strict adherence to `llmdoc/reference/style-hemingway.md`.
- NO "what" comments (e.g., `// Loop through items`).
- Comments explain WHY, not WHAT.
- Max nesting: 3 levels.
- Max function length: 20 lines.
- Type definitions before logic (Newspaper Structure).

**Negative Constraints:**
- **FORBIDDEN:** `useState` for animation states inside `useFrame`.
- **FORBIDDEN:** Deep nesting (>3 levels).
- **FORBIDDEN:** Bureaucratic naming (e.g., `AbstractManagerImpl`).
- **FORBIDDEN:** Verbose booleans (e.g., `else { return false }`).
- **FORBIDDEN:** "What" comments that describe code execution.
- **FORBIDDEN:** Creating 3 separate `Mesh` objects for rings (MUST use `InstancedMesh`).

---

## 2. Assessment

<Assessment>
**Complexity:** Level 3 (Graphics/Math)
**Reason:** Additive blending layer stack, gyroscope rotation math, performance-tier material degradation.
</Assessment>

---

## 3. Math/Algo Specification

<MathSpec>

### 3.1 Additive Blending Layer Stack

```
Layer_1_Singularity = Sphere(radius: 0.8, material: Basic(#ffffff))
Layer_2_EnergyFlow = Sphere(radius: 2.0, material: Distort(#8b5cf6, opacity: 0.8, blend: Additive))
Layer_3_Ionization = Sphere(radius: 2.6, material: Distort(#38bdf8, opacity: 0.5, blend: Additive, side: Double))
Layer_4_Rings = InstancedMesh[3](Torus(R: 3.5, r: 0.02), material: Basic(#ffffff, blend: Additive))

RenderOrder = [1 -> 2 -> 3 -> 4]
BlendingMode = THREE.AdditiveBlending (for Layer 2, 3, 4)
```

### 3.2 Gyroscope Rotation Formula (3-Axis Orbital Rings)

```
Given:
  t = elapsedTime (from clock)
  Ring_0 = Axis(X, ω=2.0)
  Ring_1 = Axis(Y, ω=2.5)
  Ring_2 = Axis(Z, ω=3.0)

Rotation Matrix:
  Ring[i].rotation[axis] = t * ω_i

Pseudo-Code:
  ring0.rotation.x = t * 2.0
  ring1.rotation.y = t * 2.5
  ring2.rotation.z = t * 3.0
```

### 3.3 Performance Degradation Formula

```
If tier === 'low':
  Layer_2.visible = false
  Layer_3.visible = false
  Layer_4.visible = false
  Layer_1.material = Basic(#ffffff)  // Keep singularity only

If tier === 'medium':
  Layer_2.distort = 0.3  (reduce from 0.6)
  Layer_3.distort = 0.15 (reduce from 0.3)
  Layer_4.count = 2      (reduce from 3)

If tier === 'high':
  // Full spec
```

</MathSpec>

---

## 4. Type Definitions (Newspaper Structure)

<TypeSpec>

```typescript
interface RingConfig {
  axis: 'x' | 'y' | 'z';
  speed: number;
}

interface LayerVisibility {
  singularity: boolean;    // Always true
  energyFlow: boolean;     // false on 'low'
  ionization: boolean;     // false on 'low'
  rings: boolean;          // false on 'low'
}

interface MaterialConfig {
  energyFlowDistort: number;
  ionizationDistort: number;
  ringCount: number;
}

type PerformanceTier = 'high' | 'medium' | 'low';

const TIER_CONFIGS: Record<PerformanceTier, {
  visibility: LayerVisibility;
  material: MaterialConfig;
}>;
```

</TypeSpec>

---

## 5. The Plan

<ExecutionPlan>

**Block 1: Type System & Constants**
1. Define `RingConfig`, `LayerVisibility`, `MaterialConfig` types at top of file.
2. Define `RING_AXES` constant array: `[{ axis: 'x', speed: 2.0 }, { axis: 'y', speed: 2.5 }, { axis: 'z', speed: 3.0 }]`.
3. Define `TIER_CONFIGS` object with 3 tier profiles.

**Block 2: Performance Hook Integration**
1. Import `usePerformanceTier` from `app/hooks/use-performance-tier.ts`.
2. Call hook at component top: `const { tier } = usePerformanceTier()`.
3. Derive `visibility` and `materialConfig` from `TIER_CONFIGS[tier]`.

**Block 3: Layer 1 - Singularity**
1. Create `<mesh>` with `<sphereGeometry args={[0.8, 32, 32]} />`.
2. Use `<meshBasicMaterial color="#ffffff" toneMapped={false} />`.
3. Always visible (no conditional rendering).

**Block 4: Layer 2 - Energy Flow**
1. Wrap in conditional: `{visibility.energyFlow && ...}`.
2. Create `<mesh>` with `<sphereGeometry args={[2.0, 64, 64]} />`.
3. Use `<MeshDistortMaterial color="#8b5cf6" transparent opacity={0.8} blending={THREE.AdditiveBlending} distort={materialConfig.energyFlowDistort} speed={3} />`.
4. Import `THREE` from `'three'` for blending constant.

**Block 5: Layer 3 - Ionization Cloud**
1. Wrap in conditional: `{visibility.ionization && ...}`.
2. Create `<mesh>` with `<sphereGeometry args={[2.6, 64, 64]} />`.
3. Use `<MeshDistortMaterial color="#38bdf8" transparent opacity={0.5} blending={THREE.AdditiveBlending} distort={materialConfig.ionizationDistort} speed={5} side={THREE.DoubleSide} />`.

**Block 6: Layer 4 - Orbital Rings (InstancedMesh)**
1. Wrap in conditional: `{visibility.rings && ...}`.
2. Create `useRef<InstancedMesh>(null)` for ring mesh.
3. Use `<instancedMesh ref={ringRef} args={[undefined, undefined, materialConfig.ringCount]}>`.
4. Inside: `<torusGeometry args={[3.5, 0.02, 16, 64]} />`.
5. Inside: `<meshBasicMaterial color="#ffffff" blending={THREE.AdditiveBlending} transparent opacity={0.8} />`.

**Block 7: Animation Loop (useFrame)**
1. Import `useFrame` from `@react-three/fiber`.
2. Destructure `{ clock }` from `useFrame` callback.
3. For each ring instance (loop from 0 to `materialConfig.ringCount - 1`):
   - Create temp `Matrix4` and `Euler`.
   - Set rotation: `euler[RING_AXES[i].axis] = clock.elapsedTime * RING_AXES[i].speed`.
   - Apply to instance: `ringRef.current.setMatrixAt(i, matrix.makeRotationFromEuler(euler))`.
4. Call `ringRef.current.instanceMatrix.needsUpdate = true`.

**Block 8: Integration Point**
1. Export component as `EnergyCore`.
2. In `app/components/stage/scene.tsx` Line 26:
   - Replace `<QuantumSphere scale={0.5} />` with `<EnergyCore scale={0.5} />`.
3. Update import: `import { EnergyCore } from './energy-core';`.

**Block 9: Cleanup**
1. Delete old `app/components/stage/quantum-sphere.tsx` (after verification).
2. Update `app/components/stage/index.ts` export map.

</ExecutionPlan>

---

## 6. Implementation Checklist

**Pre-Implementation:**
- [ ] Verify `MeshDistortMaterial` is from `@react-three/drei`.
- [ ] Verify `THREE.AdditiveBlending` and `THREE.DoubleSide` imports.
- [ ] Confirm `usePerformanceTier` hook is stable.

**Core Implementation:**
- [ ] Type definitions at top (Newspaper Structure).
- [ ] Constants: `RING_AXES`, `TIER_CONFIGS`.
- [ ] Layer 1: Basic white singularity.
- [ ] Layer 2: Purple energy flow with additive blending.
- [ ] Layer 3: Cyan ionization cloud with double-side rendering.
- [ ] Layer 4: 3 rings using `InstancedMesh`.
- [ ] Gyroscope rotation logic in `useFrame`.
- [ ] Performance tier conditional rendering.

**Validation:**
- [ ] Test on 'high' tier: All 4 layers visible, smooth rotation.
- [ ] Test on 'medium' tier: Reduced distortion values, 2 rings.
- [ ] Test on 'low' tier: Only singularity visible.
- [ ] Verify additive blending creates "glow" effect.
- [ ] Verify no stuttering in rotation (no `useState` inside `useFrame`).

**Style Compliance:**
- [ ] Max nesting ≤ 3 levels.
- [ ] No "what" comments.
- [ ] Early returns used where applicable.
- [ ] Function length ≤ 20 lines (or split into helpers).
- [ ] Type definitions before logic.

**Integration:**
- [ ] Replace `QuantumSphere` in `scene.tsx`.
- [ ] Update exports in `index.ts`.
- [ ] Verify visual hierarchy: Singularity -> Energy Flow -> Ionization -> Rings.
- [ ] Confirm orbital rings rotate on 3 different axes.

---

## 7. Risk Mitigation

**Risk 1: InstancedMesh Matrix Update Performance**
- **Mitigation:** Only update matrices when `visibility.rings === true`. On 'low' tier, skip loop entirely.

**Risk 2: Additive Blending Over-Saturation**
- **Mitigation:** Use `opacity` values (0.8, 0.5) to control blend intensity. Adjust if too bright.

**Risk 3: Distortion Shader Cost on Medium Tier**
- **Mitigation:** Reduce `distort` values (0.6 -> 0.3, 0.3 -> 0.15) instead of disabling entirely.

**Risk 4: Ring Geometry Complexity**
- **Mitigation:** Use low-poly torus: `args={[3.5, 0.02, 16, 64]}` (16 radial segments, 64 tubular).

---

## 8. Reference Map

| ID | Source | Purpose |
|----|--------|---------|
| `style-hemingway` | `llmdoc/reference/style-hemingway.md` | Code style rules |
| `use-performance-tier` | `app/hooks/use-performance-tier.ts` | Performance tier hook |
| `tech#dual-loop` | `llmdoc/reference/tech.md#2` | State management rules |
| `tech#instancing` | `llmdoc/reference/tech.md#3` | InstancedMesh usage |
| `scene.tsx` | `app/components/stage/scene.tsx` | Integration point |

---

## 9. Final Notes

- **Core Principle:** Additive blending creates visual depth hierarchy (bright core -> energy flow -> diffuse cloud -> orbital rings).
- **Performance First:** Tier system ensures low-end devices get a stable experience (singularity only) without degrading high-end visuals.
- **Math-Driven:** Rotation formula is explicit, deterministic, GPU-friendly (no CPU-side calculations per frame beyond matrix updates).
- **Style-Compliant:** Types first, logic second, comments only for WHY (e.g., "Skip rings on low tier - GPU bottleneck").
