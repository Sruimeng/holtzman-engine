import { Environment, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { AdvancedLighting } from './advanced-lighting';
import { AdvancedPostProcessing } from './advanced-post-processing';
import { AgentMonolith } from './agent-monolith';
import { CameraRig } from './camera-rig';
import { DataTesseracts } from './data-tesseracts';
import { EnergyCore } from './quantum-sphere';

export function Scene() {
  return (
    <div className="absolute inset-0 bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 0, 25], fov: 35 }}
        gl={{ antialias: false, alpha: false, stencil: false, depth: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#050505']} />
        <Suspense fallback={null}>
          <Environment files="/static/hdr/studio.hdr" />
          <Stars />
          <AdvancedLighting />
          <group position={[0, 0, 0]}>
            <EnergyCore scale={0.5} />
            <AgentMonolith />
            <DataTesseracts args={[undefined, undefined, 40]} />
          </group>
          <CameraRig />
          <AdvancedPostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
