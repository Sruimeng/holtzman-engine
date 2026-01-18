import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const PARTICLE_COUNT = 50;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  isSquare: boolean;
}

/**
 * Data Dust - floating particles with Brownian motion and upward drift.
 * PRD Spec: Layer 2 (氛围) - 模拟深海/太空悬浮杂质
 *
 * Performance fix: avoid ctx.scale accumulation on resize
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const dimensionsRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = (w: number, h: number) => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.15 - Math.random() * 0.2,
        size: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.3,
        isSquare: Math.random() > 0.7,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      dimensionsRef.current = { w, h, dpr };

      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { w, h, dpr } = dimensionsRef.current;
      const particles = particlesRef.current;

      // Reset transform and clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Brownian motion
        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.015;

        // Clamp velocity
        p.vx = Math.max(-0.4, Math.min(0.4, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.1, p.vy));

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Draw
        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;

        if (p.isSquare) {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
    />
  );
}
