---
id: strategy-shadertoy-blob-port
type: strategy
target: EnergyCore Blob Shader Integration
complexity: Level 3
priority: critical
created: 2026-01-17
---

# Strategy: Shadertoy Blob Shader → React Three Fiber

## 1. Analysis

**Context:**
- Target: Replace `MeshDistortMaterial` in `quantum-sphere.tsx` with custom blob shader
- Shader implements procedural blob with texture distortion + edge glow
- User texture: `/public/static/1.jpg`
- Pattern: Follow `quantum.ts` (shaderMaterial + extend)

**Constitution:**
- Ref: `style-hemingway` (Iceberg Principle, No "what" comments)
- Ref: `tech.md` (Performance tiering, Low tier disables custom shaders)
- Pattern: `quantum.ts` (Vertex + Fragment + TypeScript interface)

**Style Protocol:**
- Strict adherence to Hemingway rules (Ref: llmdoc/reference/style-hemingway.md)
- Type definitions BEFORE implementation
- No bureaucratic naming (`AbstractBlobMaterialImpl` ❌)
- Early returns, flat conditionals
- Comments explain WHY, not WHAT

**Negative Constraints:**
- ❌ NO Shadertoy variable names (`iTime`, `iChannel0`, `fragCoord`)
- ❌ NO `new` in `useFrame` loop
- ❌ NO React state updates for time uniform (use ref)
- ❌ NO fallback to `MeshDistortMaterial` on low tier (use `meshBasicMaterial`)

## 2. Assessment

<Assessment>
**Complexity:** Level 3 (Custom GLSL + Texture Sampling + R3F Integration)

**Risk Areas:**
1. Texture coordinate wrapping (Shadertoy defaults differ from Three.js)
2. Alpha blending mode (requires `transparent`, `depthWrite=false`, `AdditiveBlending`)
3. Performance on low-tier devices (must disable via tier check)

**Dependencies:**
- `@react-three/drei` (`useTexture`, `shaderMaterial`)
- `@react-three/fiber` (`extend`, `useFrame`)
- `@/hooks` (`usePerformanceTier`)
</Assessment>

## 3. Math/Algo Specification

<MathSpec>
**GLSL Conversion (Shadertoy → Three.js):**

```glsl
// INPUT (Shadertoy):
// - fragCoord: vec2 (pixel coordinates)
// - iResolution: vec3 (viewport size)
// - iTime: float
// - iChannel0: sampler2D

// OUTPUT (Three.js):
// - vUv: vec2 (from vertex shader, range [0, 1])
// - uTime: uniform float
// - uTexture: uniform sampler2D
```

**Blob Function Logic:**
```
1. Center = vec2(0, 0) in UV space
2. Distance = length(Center - vUv)
3. EdgeGlow = exp(-12 * abs(Distance - 0.8 * uSize) / uSize)
4. Alpha = smoothstep(0.0, 0.2 * uSize, uSize - Distance)
5. Texture Distortion:
   - newUv = 0.2 * (pos / (1.2 - Distance) + 0.5 * uTime * rot)
   - Sample texture with UV offset based on blue channel
```

**Vertex Shader:**
```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**Fragment Shader (Core Logic):**
```glsl
uniform float uTime;
uniform sampler2D uTexture;
uniform float uSize;

vec3 hb(vec2 pos, float t, float time, vec2 rot) {
  vec2 newUv = 0.2 * (pos / (1.2 - t) + 0.5 * time * rot);
  float texSample = texture2D(uTexture, newUv).b;
  float uOff = 0.2 * (texSample + 0.3 * time);
  vec2 starUV = newUv + vec2(uOff, 0.0);
  return vec3(0.3, 0.3, 1.0) + 1.3 * texture2D(uTexture, starUV).b;
}

void main() {
  vec2 center = vec2(0.5, 0.5);
  vec2 pos = center - vUv;
  float t = length(pos);
  float st = uSize - t;
  vec2 rot = 0.005 * vec2(sin(uTime / 16.0), sin(uTime / 12.0));

  float alpha = smoothstep(0.0, 0.2 * uSize, st);
  vec3 col = hb(pos, t, uTime, rot);

  float a1 = smoothstep(-1.4, -1.0, -col.b);
  col = mix(col, hb(pos, t, -uTime, -rot), a1);
  col += 0.8 * exp(-12.0 * abs(t - 0.8 * uSize) / uSize);

  float a2 = smoothstep(-1.4, -1.0, -col.b);
  alpha -= a2;

  gl_FragColor = vec4(col, alpha);
}
```
</MathSpec>

## 4. The Plan

<ExecutionPlan>

**Block 1: Shader File Creation**
1. Create `/app/lib/three/shaders/blob.ts`
2. Define TypeScript interface:
   ```ts
   interface BlobMaterialUniforms {
     uTime: number;
     uTexture: THREE.Texture;
     uSize: number;
   }
   ```
3. Write vertex shader (pass vUv)
4. Write fragment shader (convert hb + blob functions)
5. Export via `shaderMaterial`:
   ```ts
   export const BlobMaterial = shaderMaterial(
     { uTime: 0, uTexture: null, uSize: 0.5 },
     blobVertexShader,
     blobFragmentShader
   );
   ```

**Block 2: Type Extension**
1. In `blob.ts`, add after material creation:
   ```ts
   extend({ BlobMaterial });

   declare module '@react-three/fiber' {
     interface ThreeElements {
       blobMaterial: ShaderMaterialProps & Partial<BlobMaterialUniforms>;
     }
   }
   ```

**Block 3: Integration into EnergyCore**
1. Import: `import { BlobMaterial } from '@/lib/three/shaders/blob';`
2. Load texture: `const texture = useTexture('/static/1.jpg');`
3. Create ref: `const matRef = useRef<ShaderMaterial>(null!);`
4. Replace singularity mesh material:
   ```tsx
   <mesh>
     <sphereGeometry args={[0.6, 32, 32]} />
     <blobMaterial
       ref={matRef}
       uTexture={texture}
       uSize={0.5}
       transparent
       blending={THREE.AdditiveBlending}
       depthWrite={false}
     />
   </mesh>
   ```
5. Animate in `useFrame`:
   ```ts
   useFrame((state) => {
     if (!matRef.current) return;
     matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
   });
   ```

**Block 4: Performance Tiering**
1. Wrap blob mesh in conditional:
   ```tsx
   {tier === 'low' ? (
     <mesh>
       <sphereGeometry args={[0.6, 32, 32]} />
       <meshBasicMaterial color={HDR_WHITE} transparent opacity={0.3} />
     </mesh>
   ) : (
     <mesh>
       <sphereGeometry args={[0.6, 32, 32]} />
       <blobMaterial ... />
     </mesh>
   )}
   ```

**Block 5: Texture Configuration**
1. Ensure texture wrapping matches Shadertoy behavior:
   ```ts
   const texture = useTexture('/static/1.jpg');
   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
   ```
2. Verify `/public/static/1.jpg` exists (User provided path)

**Block 6: Visual Verification**
1. Test on high tier: Blob should animate with texture distortion
2. Test on low tier: Should fallback to simple white sphere
3. Verify alpha blending (no z-fighting with fusion layer)
4. Check edge glow visibility (exponential term in fragment shader)

</ExecutionPlan>

## 5. File Checklist

**New Files:**
- `/app/lib/three/shaders/blob.ts` (Vertex + Fragment + Material Export)

**Modified Files:**
- `/app/components/stage/quantum-sphere.tsx` (Replace singularity material)

**Assets:**
- `/public/static/1.jpg` (User-provided texture, verify exists)

## 6. Validation Criteria

**Functional:**
- [ ] Blob animates with procedural distortion
- [ ] Texture sampling visible (blue channel drives UV offset)
- [ ] Edge glow visible (exponential falloff at radius ~0.8)
- [ ] Alpha channel smooth (no hard edges)

**Performance:**
- [ ] High tier: 60fps maintained
- [ ] Low tier: Fallback to `meshBasicMaterial`
- [ ] No console errors on texture load

**Code Quality:**
- [ ] No "what" comments (only "why" if needed)
- [ ] Type definitions at top of file
- [ ] No Shadertoy variable names
- [ ] Follows `quantum.ts` pattern exactly

## 7. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Texture not found | Add error boundary, fallback to white noise |
| UV mapping mismatch | Test with debug mode (render raw vUv as color) |
| Performance regression | Profile with r3f-perf, disable on tier drop |
| Alpha blending artifacts | Ensure `depthWrite=false` + `AdditiveBlending` |

## 8. References

- Pattern Source: `/app/lib/three/shaders/quantum.ts`
- Integration Target: `/app/components/stage/quantum-sphere.tsx`
- Style Guide: `llmdoc/reference/style-hemingway.md`
- Performance Rules: `llmdoc/reference/tech.md` (Section 5)

---

**Next Action:** Invoke Worker to implement Block 1-6.
