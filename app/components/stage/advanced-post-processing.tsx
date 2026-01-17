import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';

export function AdvancedPostProcessing() {
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={0.3} mipmapBlur intensity={0.1} />
      <Noise opacity={0.01} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
