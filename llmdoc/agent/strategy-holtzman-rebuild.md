# Strategy: Holtzman Engine Rebuild (v2)

## 1. Analysis
* **Context:** Current 3D core (Holtzman) requires unification. Transitioning to high-performance R3F/Drei architecture.
* **Constitution:** `llmdoc/reference/style-hemingway.md` (Iceberg Principle).
* **Style Protocol:** High Signal, Low Noise. Type definitions > Comments.
* **Negative Constraints:**
    * No `useEffect` for animation loops (use `useFrame`).
    * No heavy logic inside render loops.
    * No relative paths in imports.

## 2. Assessment
<Assessment>
**Complexity:** Level 3 (Graphics/Math)
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
**A. Quantum Sphere (GLSL Fragment Logic)**
1. `Noise = Simplex3D(Position * Scale + Time * Speed)`
2. `Fresnel = pow(1.0 - dot(ViewDir, Normal), Power)`
3. `Intensity = SmoothStep(Threshold, Threshold + Feather, Noise)`
4. `Output = mix(BaseColor, GlowColor, Intensity * Fresnel)`

**B. Monolith Material (Physical Props)**
1. `Transmission = 0.95` (Glass-like)
2. `Roughness = 0.1` (Polished)
3. `IOR = 1.45` (Acrylic/Glass)
4. `Thickness = 2.0` (Volume refraction)
5. `AttenuationColor = #ffffff` (Clear)
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Tabula Rasa**
1. Delete `app/components/stage/*`.
2. Delete `app/lib/three/*`.
3. Verify `package.json` for `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`.

**Block 2: Core Geometry & Shader**
1. Create `app/lib/three/shaders/quantum.glsl`.
2. Implement `QuantumSphere.tsx` (ShaderMaterial implementation).
3. Implement `Scene.tsx` (Canvas root, Suspense, Preload).

**Block 3: Monolith & Instancing**
1. Implement `AgentMonolith.tsx` (MeshPhysicalMaterial).
2. Implement `DataTesseracts.tsx` (InstancedMesh for performance).
3. Implement `CameraRig.tsx` (Dampened mouse tracking).

**Block 4: Atmosphere**
1. Implement `AdvancedLighting.tsx` (Ambient, Spot, RectArea).
2. Implement `AdvancedPostProcessing.tsx` (Bloom, Noise, Vignette).
3. Integrate all into `app/routes/boardroom/route.tsx`.
</ExecutionPlan>
