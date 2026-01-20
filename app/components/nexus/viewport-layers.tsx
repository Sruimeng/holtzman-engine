import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * L0: Deep Void - base layer (slate-950)
 * L1: Grid - perspective grid lines
 * L2: Light Columns - blue gradient columns on sides
 * L3: Vignette - radial gradient overlay
 * L4: Noise - texture layer
 * L5+: Content
 */
export function ViewportLayers({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* L1: Perspective Grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />

      {/* L2: Left Light Column */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 top-0 z-1 w-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 0% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)
          `,
        }}
      />

      {/* L2: Right Light Column */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 top-0 z-1 w-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 100% at 100% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)
          `,
        }}
      />

      {/* L3: Center Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-1"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* L4: Vignette */}
      <div className="bg-radial-vignette pointer-events-none fixed inset-0 z-2" />

      {/* L5: Noise Texture */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-3" />

      {/* L6+: Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
