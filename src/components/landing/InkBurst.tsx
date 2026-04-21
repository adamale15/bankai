// Deterministic seeded random — avoids hydration mismatch
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function InkBurst() {
  const count = 140;
  const cx = 50;
  const cy = 50;

  const lines = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360;
    const rad = (angle * Math.PI) / 180;
    const length = 28 + seededRand(i * 3) * 52;
    const width = 0.15 + seededRand(i * 7) * 0.85;
    const opacity = 0.12 + seededRand(i * 11) * 0.5;
    const startR = 3.5 + seededRand(i * 13) * 3;
    return {
      x1: cx + Math.cos(rad) * startR,
      y1: cy + Math.sin(rad) * startR,
      x2: cx + Math.cos(rad) * length,
      y2: cy + Math.sin(rad) * length,
      width,
      opacity,
    };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="ib-vignette" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#050505" stopOpacity="0" />
          <stop offset="70%" stopColor="#050505" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id="ib-glow" cx="50%" cy="50%" r="20%">
          <stop offset="0%" stopColor="#2a1040" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0" />
        </radialGradient>
      </defs>

      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#111111"
          strokeWidth={l.width}
          strokeOpacity={l.opacity}
        />
      ))}

      <rect width="100" height="100" fill="url(#ib-vignette)" />
      <rect width="100" height="100" fill="url(#ib-glow)" />
    </svg>
  );
}
