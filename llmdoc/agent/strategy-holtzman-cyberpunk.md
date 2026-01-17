# Strategy: Holtzman Engine Cyberpunk Upgrade

## 1. Analysis
* **Context:** Visual overhaul of 3D Core. Target: Cyberpunk/Neon aesthetic.
* **Constitution:** Ref `llmdoc/reference/style-hemingway.md` (Iceberg Principle).
* **Style Protocol:** Strict Adherence to Hemingway. High Signal, No Fluff.
* **Negative Constraints:**
    * No `MeshBasicMaterial` for emissive (use HDR colors).
    * No default post-processing settings.
    * No complex custom shaders (use `drei` abstractions).

## 2. Assessment
<Assessment>
**Complexity:** Level 3
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
1. **HDR Emissive:**
   $C_{neon} = [10, 2, 20]$ (Purple High-Dynamic Range)
   $M_{core} = \{ color: C_{neon}, toneMapped: false \}$

2. **Transmission (Glass):**
   $M_{glass} = \{ \tau: 1.0, \delta: 3.0, \rho: 0.0, \lambda_{ab}: 0.15, \sigma_{blur}: 0.1 \}$
   $M_{frosted} = M_{glass} + \{ \rho: 0.2 \}$

3. **Bloom Pipeline:**
   $B_{out} = \text{Threshold}(L_{in}, 1.0) \cdot 2.0$ (MipmapBlur: true)
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Core & Lighting**
1. Edit `QuantumSphere.tsx`: Apply $M_{core}$.
2. Inject `PointLight`: $I=10$, Color=Purple.

**Block 2: Glass Structures**
1. Edit `AgentMonolith.tsx`: Apply `MeshTransmissionMaterial` ($M_{glass}$).
2. Edit `DataTesseracts.tsx`: Apply `MeshTransmissionMaterial` ($M_{frosted}$).

**Block 3: Atmosphere**
1. Edit `AdvancedPostProcessing.tsx`:
2. Enable `Bloom`: Threshold 1, Intensity 2, MipmapBlur.
3. Enable `Vignette`: Focus center.
</ExecutionPlan>
