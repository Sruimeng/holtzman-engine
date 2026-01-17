# Strategy: Holtzman Plasma Core Rewrite

## 1. Analysis
* **Context:** Upgrade `QuantumSphere.tsx` to "Holtzman" visual standard. 4-Layer Plasma architecture required.
* **Constitution:** Ref: `llmdoc/reference/style-hemingway.md` (Iceberg Principle).
* **Style Protocol:** Strict Adherence. No boilerplate. Props > State.
* **Negative Constraints:**
    * No complex shaders (use Drei abstractions).
    * No `useFrame` unless animating refs directly.
    * No verbose comments.

## 2. Assessment
<Assessment>
**Complexity:** Level 3 (Graphics)
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
**Layer Topology:**
1. **Singularity ($L_1$):**
   * $R = 1.0$
   * $\text{Mat} = \text{Basic}(\text{Color}: \text{#E0FFFF}, \text{ToneMapped}: \text{false})$

2. **Plasma ($L_2$):**
   * $R = 2.2$
   * $\text{Mat} = \text{Distort}(\text{Color}: \text{#8A2BE2}, \text{Speed}: 2.0, \text{Distort}: 0.4)$

3. **Containment ($L_3$):**
   * $R = 2.8$
   * $\text{Mat} = \text{Standard}(\text{Trans}: \text{true}, \text{Opac}: 0.1, \text{Metal}: 0.9, \text{Rough}: 0.1)$

4. **Stardust ($L_4$):**
   * $\text{Scale} = 6.0$
   * $\text{Count} = 100$
   * $\text{Color} = \text{#00FFFF}$
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Setup**
1. Import `{ MeshDistortMaterial, Sparkles }` from `@react-three/drei`.
2. Import `{ Sphere }` (or use `<sphereGeometry />`).

**Block 2: Composition**
1. **Root Group:** `<group ref={ref} {...props}>`
2. **L1 Singularity:** Mesh > Sphere(1) > MeshBasicMaterial.
3. **L2 Plasma:** Mesh > Sphere(2.2) > MeshDistortMaterial.
4. **L3 Containment:** Mesh > Sphere(2.8) > MeshStandardMaterial.
5. **L4 Stardust:** `<Sparkles scale={6} size={4} count={100} color="cyan" />`.
</ExecutionPlan>
