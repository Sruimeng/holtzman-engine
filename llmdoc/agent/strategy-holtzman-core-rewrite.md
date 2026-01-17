# Strategy: Holtzman Core Rewrite

## 1. Analysis
* **Context:** Upgrade `QuantumSphere.tsx` to multi-layered gyroscopic visualization.
* **Constitution:** Ref `llmdoc/reference/style-hemingway.md`.
* **Style Protocol:** Strict Adherence (Iceberg Principle, No Fluff).
* **Negative Constraints:**
    * No `useState` inside `useFrame`.
    * No memory leaks (dispose geometries/materials).
    * No complex physics (kinematic rotation only).

## 2. Assessment
<Assessment>
**Complexity:** Level 3 (Graphics)
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
*Inputs: t (clock.elapsedTime)*

1. **Core (Y-Axis Slow):**
   `Core.rotation.y = t * 0.2`

2. **Shell (Counter-Y Medium):**
   `Shell.rotation.y = -t * 0.5`

3. **Ring 1 (Gyroscopic Fast):**
   `Ring1.rotation.x = t * 2.0`
   `Ring1.rotation.y = t * 1.0`

4. **Ring 2 (Gyroscopic Offset):**
   `Ring2.rotation.x = t * 1.5`
   `Ring2.rotation.y = -t * 2.0`
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Setup**
1. Create `app/components/stage/quantum-sphere.tsx`.
2. Define Refs: `coreRef`, `shellRef`, `ring1Ref`, `ring2Ref`.
3. Define Geometries:
   - Core: `SphereGeometry(1, 32, 32)`
   - Shell: `SphereGeometry(1.5, 16, 16)`
   - Rings: `TorusGeometry(2.2, 0.05, 16, 100)`

**Block 2: Animation**
1. Implement `useFrame`.
2. Apply MathSpec logic to Refs.

**Block 3: Composition**
1. Render `<group>` container.
2. Child 1: Core (Purple #8b5cf6, Emissive).
3. Child 2: Shell (Cyan #06b6d4, Wireframe).
4. Child 3: Ring 1 (Blue #3b82f6).
5. Child 4: Ring 2 (Blue #3b82f6).
</ExecutionPlan>
