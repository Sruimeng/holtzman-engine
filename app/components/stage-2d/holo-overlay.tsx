/**
 * Holographic overlay effect - unifies the visual composition.
 * Adds vignette, noise texture, and optional scanlines.
 */
export function HoloOverlay() {
  return (
    <div className="fixed inset-0 z-[999] pointer-events-none select-none">
      {/* 1. Vignette - focus attention to center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* 2. Noise texture - adds texture/grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Scanlines - CRT monitor effect */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
          backgroundSize: '100% 2px',
        }}
      />

      {/* 4. RGB chromatic aberration hint on edges */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background: 'linear-gradient(90deg, rgba(255,0,0,0.5) 0%, transparent 5%, transparent 95%, rgba(0,255,255,0.5) 100%)',
        }}
      />
    </div>
  );
}
