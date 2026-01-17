import { usePerformanceTier } from '@/hooks';
import '@/lib/three/shaders/blob';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { ComponentProps } from 'react';
import { useRef } from 'react';
import * as THREE from 'three';

type HDRColor = readonly [r: number, g: number, b: number];

const HDR_WHITE: HDRColor = [10, 10, 10];

export function EnergyCore(props: ComponentProps<'group'>) {
  const { tier } = usePerformanceTier();
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const texture = useTexture('/static/1.jpg', (tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  });

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group {...props}>
      {tier === 'low' ? (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial
            color={HDR_WHITE}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[3.0, 32, 32]} />
          {/* @ts-expect-error extend() registers material at runtime */}
          <blobMaterial
            ref={matRef}
            uTexture={texture}
            uSize={2.0}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}
