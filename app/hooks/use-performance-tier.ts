import { useEffect, useRef, useState } from 'react';

type Tier = 'high' | 'medium' | 'low';

interface TierConfig {
  tier: Tier;
  particleCount: number;
  shadowsEnabled: boolean;
  postProcessing: boolean;
  dpr: number;
  maxInstances: number;
  complexShaders: boolean;
}

const getDpr = () => (typeof window !== 'undefined' ? window.devicePixelRatio : 1);

const getTiers = (): Record<Tier, TierConfig> => ({
  high: {
    tier: 'high',
    particleCount: 3000,
    shadowsEnabled: true,
    postProcessing: true,
    dpr: Math.min(getDpr(), 2),
    maxInstances: 500,
    complexShaders: true,
  },
  medium: {
    tier: 'medium',
    particleCount: 1200,
    shadowsEnabled: false,
    postProcessing: true,
    dpr: Math.min(getDpr(), 1.5),
    maxInstances: 300,
    complexShaders: true,
  },
  low: {
    tier: 'low',
    particleCount: 400,
    shadowsEnabled: false,
    postProcessing: false,
    dpr: 1,
    maxInstances: 100,
    complexShaders: false,
  },
});

const FPS_THRESHOLD_LOW = 25;
const FPS_THRESHOLD_MEDIUM = 45;
const SAMPLE_SIZE = 90;

function detectGPUTier(): Tier {
  if (typeof document === 'undefined') return 'medium';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) return 'low';

  const renderer = gl.getParameter(gl.RENDERER);
  const vendor = gl.getParameter(gl.VENDOR);

  const highEndGPUs = [
    /RTX\s*40\d0/i,
    /RTX\s*30\d0/i,
    /GTX\s*16\d0/i,
    /GTX\s*10\d0/i,
    /Radeon.*RX\s*[567]\d00/i,
    /Apple.*M[123]/i,
    /Intel.*Arc/i,
  ];

  const lowEndGPUs = [
    /intel.*hd/i,
    /intel.*uhd/i,
    /intel.*iris.*5\d00/i,
    /SwiftShader/i,
    /llvmpipe/i,
  ];

  for (const pattern of highEndGPUs) {
    if (pattern.test(renderer) || pattern.test(vendor)) {
      return 'high';
    }
  }

  for (const pattern of lowEndGPUs) {
    if (pattern.test(renderer) || pattern.test(vendor)) {
      return 'low';
    }
  }

  return 'medium';
}

export function usePerformanceTier(): TierConfig {
  const [tier, setTier] = useState<Tier>(() => detectGPUTier());
  const framesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const adaptiveRef = useRef<boolean>(true);

  useEffect(() => {
    const delayedStart = setTimeout(() => {
      const measureFps = () => {
        const now = performance.now();

        if (lastTimeRef.current > 0) {
          const delta = now - lastTimeRef.current;

          if (delta > 0) {
            const fps = 1000 / delta;
            framesRef.current.push(fps);

            if (framesRef.current.length > SAMPLE_SIZE) {
              framesRef.current.shift();
            }

            if (framesRef.current.length === SAMPLE_SIZE && adaptiveRef.current) {
              const avg = framesRef.current.reduce((a, b) => a + b, 0) / SAMPLE_SIZE;
              const min = Math.min(...framesRef.current);

              if (min < 20 || avg < FPS_THRESHOLD_LOW) {
                setTier((current) => current !== 'low' ? 'low' : current);
              } else if (avg < FPS_THRESHOLD_MEDIUM) {
                setTier((current) => current === 'high' ? 'medium' : current);
              } else if (avg > 55 && min > 45) {
                setTier((current) => current === 'low' ? 'medium' : current);
              }
            }
          }
        }

        lastTimeRef.current = now;
        if (adaptiveRef.current) {
          rafRef.current = requestAnimationFrame(measureFps);
        }
      };

      rafRef.current = requestAnimationFrame(measureFps);
    }, 2000);

    return () => {
      clearTimeout(delayedStart);
      adaptiveRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return getTiers()[tier];
}
