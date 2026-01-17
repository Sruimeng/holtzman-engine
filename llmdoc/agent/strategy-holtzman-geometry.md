# Strategy: Holtzman Engine Geometry Reconstruction

## 1. Analysis
* **Context:** Geometric reconstruction of Holtzman Engine 3D Core components.
* **Constitution:**
    *   Ref: `llmdoc/reference/style-hemingway.md` (Iceberg Principle).
    *   Ref: `llmdoc/reference/tech.md` (React Three Fiber Standards).
* **Style Protocol:** Strict Adherence to Hemingway. High Signal. No Fluff.
* **Negative Constraints:**
    *   No memory leaks (dispose geometries/materials).
    *   No `new Vector3()` inside `useFrame` loops.
    *   No complex physics (kinematic only).

## 2. Assessment
<Assessment>
**Complexity:** Level 3 (Graphics/Math)
</Assessment>

## 3. Math/Algo Specification
<MathSpec>
**Monolith Vectors:**
$M_{left} = [-6, 0, 0]$
$M_{right} = [6, 0, 0]$
$Target = [0, 0, 0]$

**Tesseract Orbital Logic (per instance $i$):**
1. $t = clock.elapsed + offset_i$
2. $P_x = R \cdot \cos(t \cdot speed)$
3. $P_z = R \cdot \sin(t \cdot speed)$
4. $P_y = \sin(t) \cdot amplitude$
5. $R_{rot} = [t \cdot 0.5, t \cdot 0.5, 0]$
6. $Matrix_i = Compose(P, R_{rot}, Scale)$

**Optimization:**
*   Pre-allocate `tempObject` (Object3D) outside loop.
*   `mesh.instanceMatrix.needsUpdate = true` at frame end.
</MathSpec>

## 4. The Plan
<ExecutionPlan>
**Block 1: Core Geometry (QuantumSphere)**
1.  Create `QuantumSphere.tsx`.
2.  Geometry: `SphereGeometry(2, 32, 32)`.
3.  Material: `MeshBasicMaterial` (Purple, Wireframe: true).
4.  Animation: Slow Y-axis rotation.

**Block 2: Monolith Geometry (AgentMonolith)**
1.  Create `AgentMonolith.tsx`.
2.  Geometry: `BoxGeometry(4, 6, 0.5)`.
3.  Material: `MeshPhysicalMaterial` (White, Transparent, Opacity: 0.1, Roughness: 0.1).
4.  Placement:
    *   Instance 1: Position `[-6, 0, 0]`, LookAt `[0, 0, 0]`.
    *   Instance 2: Position `[6, 0, 0]`, LookAt `[0, 0, 0]`.

**Block 3: Tesseract Instancing (DataTesseracts)**
1.  Create `DataTesseracts.tsx`.
2.  Setup: `InstancedMesh` (Count: 40).
3.  Geometry: `BoxGeometry(0.2, 0.2, 0.2)`.
4.  Logic: Implement MathSpec orbital equations in `useFrame`.
5.  Optimization: Update instance matrix via `tempObject`.
</ExecutionPlan>
