---
id: strategy-campaign
type: strategy
related_ids: [style-hemingway, doc-standard, tech]
---

# Campaign: Liquid Plasma Upgrade

## <Constitution>
1. **Protocol**: `style-hemingway` (Iceberg Principle).
2. **Docs**: `doc-standard` (Type-First).
3. **Tech**: React Three Fiber + Custom Shaders.

## <StyleProtocol>
- **No Fluff**: Logic only.
- **Structure**: Imports -> Types -> Shader -> Component.
- **Naming**: `LiquidPlasmaMaterial`.

## Execution Blocks

### Block A: Shader Core
**Target**: `app/lib/three/shaders/liquid-plasma.ts`
**Action**: Create.
**Logic**:
1. Define `LiquidPlasmaMaterial` extending `ShaderMaterial`.
2. Vertex: Perlin noise displacement.
3. Fragment: Fresnel + Color Ramp (Purple/Cyan).
4. Uniforms: `uTime`, `uColorA`, `uColorB`.

### Block B: Component Integration
**Target**: `app/components/stage/quantum-sphere.tsx`
**Action**: Rewrite.
**Logic**:
1. Remove old geometry/material.
2. Use `sphereGeometry` (high poly).
3. Apply `LiquidPlasmaMaterial`.
4. `useFrame`: Update `uTime`.

### Block C: Scene Verification
**Target**: `app/components/stage/scene.tsx`
**Action**: Verify.
**Logic**: Ensure `QuantumSphere` props match new API (if changed).
