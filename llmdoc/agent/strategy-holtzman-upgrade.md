# Strategy: Holtzman Engine Visual Upgrade

## 1. Analysis
* **Context:** Current 3D core visual fidelity insufficient. Executing "Rescue Plan" (Glass/Energy aesthetic).
* **Constitution:** Ref `llmdoc/reference/style-hemingway.md`.
* **Style Protocol:** "Strict Adherence to Iceberg Principle. High Signal, No Fluff."
* **Negative Constraints:**
    * No `MeshStandardMaterial` for core elements (use Transmission/Shader).
    * No blocking logic in `useFrame`.
    * No hardcoded colors (use props/constants).

## 2. Assessment
<Assessment>
**Complexity:** Level 3 (Graphics/R3F)
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
*   **Crystal Transmission (Tesseracts):**
    $$ T_{props} = \{ transmission: 1, thickness: 2, roughness: 0.2, chromaticAberration: 0.2, ior: 1.5 \} $$
*   **Bloom Thresholding:**
    $$ B_{out} = \begin{cases} Color * 1.5 & \text{if } Lum > 1.0 \\ 0 & \text{else} \end{cases} $$
    $$ B_{props} = \{ luminanceThreshold: 1, mipmapBlur: true, intensity: 1.5 \} $$
*   **Energy Core Geometry:**
    $$ Core = Sphere(r) + \sum_{i=1}^{n} Torus(r_{i}, tube_{i}) $$
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Environment (Scene.tsx)**
1.  Inject `<Environment preset="city" />`.
2.  Add `<Stars />` background.
3.  Remove default ambient lights if conflicting.

**Block 2: Crystal Material (DataTesseracts.tsx)**
1.  Import `MeshTransmissionMaterial` from `@react-three/drei`.
2.  Apply $T_{props}$ to Tesseract meshes.
3.  Ensure `backside` rendering is enabled.

**Block 3: Energy Core (QuantumSphere.tsx)**
1.  Construct Central Sphere (High Emissive Color).
2.  Construct Rotating Torus Rings (x2).
3.  Apply distinct rotation speeds in `useFrame`.

**Block 4: Post-Processing (AdvancedPostProcessing.tsx)**
1.  Implement `EffectComposer`.
2.  Add `Bloom` ($B_{props}$).
3.  Add `Vignette` (eskil=false, offset=0.1, darkness=1.1).
</ExecutionPlan>
