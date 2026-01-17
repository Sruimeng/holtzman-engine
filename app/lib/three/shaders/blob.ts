import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const blobVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const blobFragmentShader = `
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform float uSize;

  varying vec2 vUv;

  vec3 hb(vec2 pos, float t, float time, vec2 rot) {
    vec2 newUv = 0.2 * (pos / (1.2 - t) + 0.5 * time * rot);
    float texSample = texture2D(uTexture, newUv).b;
    float uOff = 0.2 * (texSample + 0.3 * time);
    vec2 starUV = newUv + vec2(uOff, 0.0);
    return vec3(0.3, 0.3, 1.0) + 1.3 * texture2D(uTexture, starUV).b;
  }

  void main() {
    // Remap sphere UV to centered coordinates [-0.5, 0.5]
    vec2 uv = vUv - 0.5;
    float t = length(uv) * 2.0;
    float st = uSize - t;
    vec2 rot = 0.005 * vec2(sin(uTime / 16.0), sin(uTime / 12.0));

    float alpha = smoothstep(0.0, 0.2 * uSize, st);
    vec3 col = hb(uv, t, uTime, rot);

    float a1 = smoothstep(-1.4, -1.0, -col.b);
    col = mix(col, hb(uv, t, -uTime, -rot), a1);
    col += 0.8 * exp(-12.0 * abs(t - 0.8 * uSize) / uSize);

    float a2 = smoothstep(-1.4, -1.0, -col.b);
    alpha -= a2;

    // HDR boost for Bloom
    col *= 5.0;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

export const BlobMaterial = shaderMaterial(
  { uTime: 0, uTexture: null, uSize: 0.5 },
  blobVertexShader,
  blobFragmentShader,
);

extend({ BlobMaterial });
