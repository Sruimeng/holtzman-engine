import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * L0: Deep Void - base layer
 * L1: Vignette - radial gradient overlay
 * L2: Noise - texture layer (optional)
 * L3+: Content
 */
export function ViewportLayers({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-void">
      {/* L1: Vignette */}
      <div className="bg-radial-vignette pointer-events-none fixed inset-0 z-0" />

      {/* L2: Noise Texture */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-1" />

      {/* L3+: Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
