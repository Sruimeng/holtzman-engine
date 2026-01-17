import { MeshTransmissionMaterial } from '@react-three/drei';
import { type ThreeElements } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import type * as THREE from 'three';

export function AgentMonolith(props: ThreeElements['group']) {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    left.current?.lookAt(0, 0, 0);
    right.current?.lookAt(0, 0, 0);
  }, []);

  const Material = () => (
    <MeshTransmissionMaterial
      transmission={1.0}
      thickness={3.0}
      roughness={0.0}
      chromaticAberration={0.15}
      distortion={0.1}
    />
  );

  return (
    <group {...props}>
      <mesh ref={left} position={[-6, 0, 0]}>
        <boxGeometry args={[4, 6, 0.5]} />
        <Material />
      </mesh>
      <mesh ref={right} position={[6, 0, 0]}>
        <boxGeometry args={[4, 6, 0.5]} />
        <Material />
      </mesh>
    </group>
  );
}
