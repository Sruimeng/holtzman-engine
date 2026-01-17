import { Environment } from '@react-three/drei';
import { useLayoutEffect, useRef } from 'react';
import type * as THREE from 'three';

export function AdvancedLighting() {
  const rectLight = useRef<THREE.RectAreaLight>(null);

  useLayoutEffect(() => {
    rectLight.current?.lookAt(0, 0, 0);
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[20, 20, 20]}
        angle={0.2}
        penumbra={1}
        intensity={200}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <rectAreaLight
        ref={rectLight}
        width={10}
        height={10}
        color="#00ff88"
        intensity={5}
        position={[-10, 0, 10]}
      />
      <Environment preset="city" />
    </>
  );
}
