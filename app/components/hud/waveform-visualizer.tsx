'use client';

import { useEffect, useRef } from 'react';

interface Props {
  isActive?: boolean;
  height?: number;
  samples?: number;
}

const CYAN_START = '#38BDF8';
const CYAN_END = '#06B6D4';

// Simplex-like noise for organic motion
function noise(x: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

export function WaveformVisualizer({ isActive = false, height = 40, samples = 64 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const centerY = h / 2;

      ctx.clearRect(0, 0, w, h);

      const targetAmp = isActive ? 15 : 5;
      const amp = targetAmp;

      timeRef.current += isActive ? 0.08 : 0.03;
      const t = timeRef.current;

      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, CYAN_START);
      gradient.addColorStop(1, CYAN_END);

      ctx.shadowBlur = isActive ? 15 : 8;
      ctx.shadowColor = CYAN_START;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * w;
        const normalizedX = i / samples;

        const freq1 = Math.sin(normalizedX * Math.PI * 4 + t * 2) * 0.5;
        const freq2 = Math.sin(normalizedX * Math.PI * 8 + t * 3) * 0.3;
        const freq3 = noise(normalizedX * 10 + t, 1) * 0.4 - 0.2;

        const edgeFade = Math.sin(normalizedX * Math.PI);

        const y = centerY + (freq1 + freq2 + freq3) * amp * edgeFade;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      ctx.shadowBlur = 4;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isActive, samples]);

  return <canvas ref={canvasRef} className="w-full" style={{ height }} />;
}
