---
id: strategy-energycore-hdr-rewrite
type: strategy
priority: critical
date: 2026-01-17
target: app/components/stage/quantum-sphere.tsx
complexity: level-3
---

# Strategy: EnergyCore HDR Rewrite

## 1. Analysis

### Context
Current `EnergyCore` implementation exhibits "solid sphere" appearance due to:
- Missing `depthWrite={false}` on all transparent layers
- Hex color strings instead of HDR RGB arrays
- Insufficient transparency/opacity settings
- No particle storm layer (Sparkles)

### Constitution
**Ref:** `llmdoc/reference/style-hemingway.md` (Iceberg Principle)

**Core Rules:**
1. Type Definitions > Comments
2. Early Returns > Deep Nesting
3. No "What" Comments (Only "Why")
4. Max 3-level nesting
5. Newspaper Structure (Types → Constants → Exports → Helpers)

### Style Protocol
**MANDATORY:** Strict adherence to Hemingway Style.
- Terse function bodies
- Boolean expressions without verbose conditionals
- Constants extracted to top-level
- Performance tier adaptation via early returns

### HDR Physics Model

**Core Equation:** Additive Blending with Depth-Write Suppression

```
L_final = Σ(L_i × α_i × blend_i)
```

Where:
- `L_i` = HDR luminance of layer i (RGB values > 1.0)
- `α_i` = Layer opacity (0.2 - 0.3 for transparency)
- `blend_i` = THREE.AdditiveBlending (prevents color subtraction)

**Critical Setting:**
```
depthWrite={false}  // Disables Z-buffer writes
```

**Why:** Z-buffer occlusion creates "solid" appearance. Disabling allows back layers to shine through front layers, enabling pure energy additive blending.

**Bloom Activation Threshold:**
```
luminanceThreshold={1.0}  // Already configured in advanced-post-processing.tsx
```

HDR RGB > 1.0 triggers bloom. White singularity [10,10,10] creates intense glow.

### Negative Constraints
- ❌ NO hex color strings (use HDR RGB arrays)
- ❌ NO `depthWrite` omission (MUST be `false` on all layers)
- ❌ NO `toneMapped={true}` on emissive materials (kills HDR)
- ❌ NO solid opacity (>0.3)
- ❌ NO "what" comments
- ❌ NO bureaucratic naming
- ❌ NO deep nesting (>3 levels)

---

## 2. Assessment

<Assessment>
**Complexity:** Level 3 (HDR Graphics Rendering)
**Risk:** Medium (Transparency sorting artifacts possible)
**Dependencies:**
  - `@react-three/drei` (MeshDistortMaterial, Sparkles)
  - `@react-three/fiber` (useFrame)
  - THREE.AdditiveBlending
  - Bloom post-processing (already configured)
</Assessment>

---

## 3. HDR Physics Specification

<MathSpec>

### Layer Stack (Back-to-Front Rendering)

```
Layer 4 (Outermost): Particle Storm
  ↓ (additive blend)
Layer 3: Ionization Aura
  ↓ (additive blend)
Layer 2: Fusion Core
  ↓ (additive blend)
Layer 1: Singularity (Innermost)
```

### Pseudo-Code for HDR Color Blending

```typescript
// Layer physics properties
type HDRLayer = {
  radius: number;
  color: [r: number, g: number, b: number];  // HDR range: 0-10+
  opacity: number;
  distort?: number;
  speed?: number;
};

// Blending formula (GPU shader level)
function renderLayer(layer: HDRLayer) {
  const material = {
    color: layer.color,
    transparent: true,
    opacity: layer.opacity,
    blending: THREE.AdditiveBlending,  // GPU: C_out = C_src × α_src + C_dst
    depthWrite: false,                 // Critical: Disable Z-buffer writes
    toneMapped: false,                 // Preserve HDR values for bloom
  };
  return material;
}

// Layer visibility based on performance tier
function getVisibleLayers(tier: PerformanceTier): LayerSet {
  if (tier === 'low') return ['singularity'];
  if (tier === 'medium') return ['singularity', 'fusion'];
  return ['singularity', 'fusion', 'ionization', 'particles'];
}
```

### Performance Tier Logic

```
High Tier:
  - All 4 layers
  - Distort: [0.6, 0.3]
  - Particle count: 200

Medium Tier:
  - Layers 1-3 only
  - Distort: [0.3, 0.15]
  - Particle count: 100

Low Tier:
  - Layer 1 only (singularity)
  - No distortion
  - No particles
```

</MathSpec>

---

## 4. Type Definitions

<TypeSpec>

```typescript
// HDR color as RGB array (not hex string)
type HDRColor = readonly [r: number, g: number, b: number];

// Layer configuration with physics properties
interface HDRLayerConfig {
  radius: number;
  color: HDRColor;
  opacity: number;
  distort?: number;
  speed?: number;
  toneMapped: boolean;
  depthWrite: boolean;
}

// Performance tier visibility mask
interface LayerVisibility {
  singularity: boolean;
  fusion: boolean;
  ionization: boolean;
  particles: boolean;
}

// Consolidated tier configuration
interface TierConfig {
  visibility: LayerVisibility;
  material: {
    fusionDistort: number;
    ionizationDistort: number;
    particleCount: number;
  };
}

type PerformanceTier = 'high' | 'medium' | 'low';
```

</TypeSpec>

---

## 5. The Plan

<ExecutionPlan>

### Block 1: Type System & Constants
1. Define `HDRColor` type (readonly tuple)
2. Define `HDRLayerConfig` interface
3. Define `TierConfig` with new visibility flags
4. Create HDR color constants:
   ```typescript
   const HDR_WHITE: HDRColor = [10, 10, 10];
   const HDR_PURPLE: HDRColor = [4, 0, 10];
   const HDR_CYAN: HDRColor = [1, 4, 10];
   const HDR_BLUE: HDRColor = [2, 8, 10];
   ```
5. Update `TIER_CONFIGS` to include `particles` visibility

### Block 2: Layer 1 (Singularity) Rewrite
1. Change `sphereGeometry` radius to `0.6`
2. Change `color` from hex to HDR array `[10, 10, 10]`
3. Add `transparent={true}`
4. Add `opacity={0.3}`
5. Add `blending={THREE.AdditiveBlending}`
6. Add `depthWrite={false}`
7. Retain `toneMapped={false}`

### Block 3: Layer 2 (Fusion Core) Rewrite
1. Keep radius at `2.0`
2. Change `color` to HDR array `[4, 0, 10]`
3. Change `opacity` to `0.3`
4. Add `depthWrite={false}`
5. Add `toneMapped={false}`
6. Update `speed={5}`
7. Update `distort={materialConfig.fusionDistort}` (0.6 high, 0.3 medium)

### Block 4: Layer 3 (Ionization) Rewrite
1. Change radius to `3.0`
2. Change `color` to HDR array `[1, 4, 10]`
3. Change `opacity` to `0.2`
4. Add `depthWrite={false}`
5. Add `toneMapped={false}`
6. Update `speed={2}`
7. Update `distort={materialConfig.ionizationDistort}` (0.3 high, 0.15 medium)
8. Retain `side={THREE.DoubleSide}`

### Block 5: Layer 4 (Particle Storm) Addition
1. Import `Sparkles` from `@react-three/drei`
2. Add conditional render based on `visibility.particles`
3. Configure:
   ```tsx
   <Sparkles
     count={materialConfig.particleCount}
     scale={6}
     size={6}
     speed={0.4}
     color={[2, 8, 10]}
   />
   ```
4. Performance tier counts: 200 (high), 100 (medium), 0 (low)

### Block 6: Orbital Rings Removal
1. **Decision:** Remove `ringRef` and orbital rings layer
2. **Rationale:** User spec defines 4 layers (Singularity, Fusion, Ionization, Particles). Rings not mentioned.
3. Delete `RING_AXES` constant
4. Delete `ringCount` from `MaterialConfig`
5. Delete `ringRef` and `useFrame` animation
6. Delete rings visibility flag

### Block 7: Comments & Documentation
1. Add **ONLY ONE** comment at top of file:
   ```typescript
   // Bloom: Requires luminanceThreshold={1} (configured in advanced-post-processing.tsx)
   ```
2. Remove all "what" comments (e.g., "Layer 1: Singularity")
3. Keep layer JSX structure self-documenting via component hierarchy

### Block 8: Validation Checklist
- [ ] All layers have `depthWrite={false}`
- [ ] All layers have `transparent={true}`, `opacity < 0.4`
- [ ] All layers have `blending={THREE.AdditiveBlending}`
- [ ] All emissive layers have `toneMapped={false}`
- [ ] All colors are HDR RGB arrays (not hex strings)
- [ ] Performance tier adaptation functional
- [ ] Sparkles imported and configured
- [ ] File follows Hemingway style (types → constants → export → helpers)
- [ ] Max 3-level nesting
- [ ] No bureaucratic naming

</ExecutionPlan>

---

## 6. Integration Notes

### Bloom Post-Processing
**File:** `app/components/stage/advanced-post-processing.tsx`

**Current Config:**
```tsx
<Bloom luminanceThreshold={1.0} mipmapBlur intensity={2.0} />
```

**Status:** ✅ Already configured correctly. HDR values > 1.0 will trigger bloom.

**No Action Required.** Add reminder comment in `quantum-sphere.tsx`.

### Performance Impact
- **High Tier:** 4 layers + 200 particles (GPU-bound)
- **Medium Tier:** 3 layers + 100 particles (balanced)
- **Low Tier:** 1 layer only (CPU-bound devices)

### Transparency Sorting
**Potential Issue:** Additive blending with `depthWrite={false}` can cause render order artifacts.

**Mitigation:** Three.js automatically sorts transparent objects back-to-front. Since all layers share same center position, order is deterministic.

**Monitor:** If flickering occurs, add `renderOrder` props (innermost = 0, outermost = 3).

---

## 7. Success Criteria

1. **Visual:**
   - No "solid sphere" appearance
   - Visible luminous glow from inner layers through outer layers
   - Bloom halo around entire structure
   - Particle storm visible at periphery

2. **Technical:**
   - All materials use HDR RGB arrays
   - All layers have `depthWrite={false}`
   - Performance tier adaptation works (test on low/medium/high)
   - No console errors or warnings

3. **Code Quality:**
   - Passes Hemingway style metrics:
     - Max nesting: 3 levels
     - No "what" comments
     - Types defined at top
     - Constants extracted
   - File length < 200 lines

---

## 8. Rollback Plan

If HDR rewrite causes performance degradation or visual artifacts:

1. **Revert to baseline:** Git checkout `quantum-sphere.tsx` from `dev` branch
2. **Incremental approach:**
   - Apply `depthWrite={false}` only
   - Convert colors to HDR one layer at a time
   - Add Sparkles last

**Checkpoint:** Test after each block in Execution Plan.

---

**END OF STRATEGY**
