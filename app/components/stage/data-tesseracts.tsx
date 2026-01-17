import { MeshTransmissionMaterial } from '@react-three/drei';
import { type ThreeElements, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 40;
const temp = new THREE.Object3D();

export function DataTesseracts(props: ThreeElements['instancedMesh']) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      offset: Math.random() * 100,
      speed: 0.2 + Math.random() * 0.5,
      amplitude: 2 + Math.random() * 3,
      radius: 4 + Math.random() * 6,
    }));
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;

    data.forEach((d, i) => {
      const time = t + d.offset;

      const px = d.radius * Math.cos(time * d.speed);
      const pz = d.radius * Math.sin(time * d.speed);
      const py = Math.sin(time) * d.amplitude;

      temp.position.set(px, py, pz);
      temp.rotation.set(time * 0.5, time * 0.5, 0);
      temp.updateMatrix();

      mesh.current!.setMatrixAt(i, temp.matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} {...props}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <MeshTransmissionMaterial
        transmission={1.0}
        thickness={3.0}
        roughness={0.2}
        chromaticAberration={0.15}
        distortion={0.1}
      />
    </instancedMesh>
  );
}
