import type { GalleryItem } from "@/data/gallery";

/** Deterministic PRNG so server and client render identical SVG. */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const LINE = "#d8d3cb";

function Mandala({ seed }: { seed: number }) {
  const r = rng(seed);
  const petals = 8 + Math.floor(r() * 8);
  const rings = [40, 70, 100, 130];
  return (
    <g fill="none" stroke={LINE} strokeWidth="1.2">
      {rings.map((rad, i) => (
        <circle key={rad} cx="200" cy="200" r={rad} strokeDasharray={i % 2 ? "2 5" : undefined} />
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <g key={i} transform={`rotate(${(360 / petals) * i} 200 200)`}>
          <path d="M200 160c18-30 18-60 0-90-18 30-18 60 0 90Z" />
          <path d="M200 100c8-12 8-24 0-36-8 12-8 24 0 36Z" />
          <circle cx="200" cy="55" r="3" fill={LINE} />
        </g>
      ))}
      <circle cx="200" cy="200" r="14" fill={LINE} />
    </g>
  );
}

function Botanical({ seed }: { seed: number }) {
  const r = rng(seed);
  const leaves = 7 + Math.floor(r() * 4);
  return (
    <g fill="none" stroke={LINE} strokeWidth="1.1" strokeLinecap="round">
      <path d="M200 360C190 280 215 200 200 60" />
      {Array.from({ length: leaves }, (_, i) => {
        const y = 320 - i * 34;
        const side = i % 2 ? 1 : -1;
        const len = 40 + r() * 30;
        return (
          <path
            key={i}
            d={`M200 ${y}c${side * len * 0.4} -20 ${side * len} -18 ${side * len} -38c${-side * len * 0.6} 0 ${-side * len} 18 ${-side * len} 38Z`}
          />
        );
      })}
      <circle cx="200" cy="56" r="6" />
    </g>
  );
}

function Geometric({ seed }: { seed: number }) {
  const r = rng(seed);
  const n = 3 + Math.floor(r() * 4);
  const poly = (rad: number, rot: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (Math.PI * 2 * i) / n + rot;
      return `${200 + rad * Math.sin(a)},${200 - rad * Math.cos(a)}`;
    }).join(" ");
  return (
    <g fill="none" stroke={LINE} strokeWidth="1.3">
      {[150, 115, 80, 45].map((rad, i) => (
        <polygon key={rad} points={poly(rad, i * 0.3)} fill={i === 3 ? LINE : "none"} />
      ))}
      <line x1="200" y1="20" x2="200" y2="380" strokeDasharray="1 6" />
      <circle cx="200" cy="200" r="170" strokeDasharray="1 4" />
    </g>
  );
}

function Dotwork({ seed }: { seed: number }) {
  const r = rng(seed);
  const dots: { x: number; y: number; s: number }[] = [];
  for (let y = 40; y < 360; y += 11) {
    for (let x = 40; x < 360; x += 11) {
      const d = Math.hypot(x - 200, y - 200);
      if (d > 150) continue;
      const lightness = (x - 120 + (y - 120)) / 300;
      const size = Math.max(0.3, 2.6 - lightness * 2.6 + (r() - 0.5) * 0.4);
      dots.push({ x, y, s: size });
    }
  }
  return (
    <g fill={LINE}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s.toFixed(2)} />
      ))}
    </g>
  );
}

function Script() {
  return (
    <g fill="none" stroke={LINE} strokeWidth="2.2" strokeLinecap="round">
      <path d="M60 220c20-60 50-60 40 0s10 40 30-10 30-40 30 0-10 50 20 20 30-60 40-20 0 50 30 20 40-50 50-10-10 40 20 30 30-40 40-30" />
      <path d="M70 250c80 10 180 10 260-6" strokeWidth="1" />
      <path d="M300 170l12-24" />
    </g>
  );
}

function Serpent() {
  return (
    <g fill="none" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round">
      <path d="M200 40v300M180 330l20 40 20-40" />
      <path d="M176 80h48" />
      <path d="M200 100c60 10 60 50 0 60s-60 50 0 60 60 50 0 60-50 30-10 50" strokeWidth="9" stroke="#0e0e0e" />
      <path d="M200 100c60 10 60 50 0 60s-60 50 0 60 60 50 0 60-50 30-10 50" />
      <circle cx="200" cy="96" r="7" fill={LINE} />
    </g>
  );
}

export function GalleryArt({ item, className = "" }: { item: GalleryItem; className?: string }) {
  const body = {
    mandala: <Mandala seed={item.seed} />,
    botanical: <Botanical seed={item.seed} />,
    geometric: <Geometric seed={item.seed} />,
    dotwork: <Dotwork seed={item.seed} />,
    script: <Script />,
    serpent: <Serpent />,
  }[item.pattern];
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label={item.alt} className={className}>
      <title>{item.alt}</title>
      <rect width="400" height="400" fill="#191715" />
      <rect width="400" height="400" fill="#2a2420" opacity=".35" />
      {body}
    </svg>
  );
}

/** Initials avatar placeholder for people photos. */
export function Avatar({ name, className = "", label }: { name: string; className?: string; label: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <svg viewBox="0 0 80 80" role="img" aria-label={label} className={className}>
      <title>{label}</title>
      <rect width="80" height="80" fill="#242424" />
      <circle cx="40" cy="32" r="14" fill="#2f2f2f" />
      <path d="M12 80c4-18 16-26 28-26s24 8 28 26z" fill="#2f2f2f" />
      <text
        x="40"
        y="47"
        textAnchor="middle"
        fontSize="24"
        fill="#ede9e3"
        fontFamily="var(--font-anton), Impact, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

/** Portrait placeholder for the founder / about page. */
export function PortraitPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 500" role="img" aria-label={label} className={className} preserveAspectRatio="xMidYMid slice">
      <title>{label}</title>
      <defs>
        <linearGradient id="portrait-bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#222" />
          <stop offset="1" stopColor="#111" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#portrait-bg)" />
      <circle cx="200" cy="190" r="74" fill="#2c2c2c" />
      <path d="M70 500c10-120 70-180 130-180s120 60 130 180z" fill="#2c2c2c" />
      <path d="M150 400c20 10 80 10 100 0" stroke="#c8ff2e" strokeWidth="2" fill="none" />
      <text x="24" y="476" fill="#6b6762" fontSize="10" letterSpacing="2" fontFamily="var(--font-jetbrains), monospace">
        PHOTO PLACEHOLDER
      </text>
    </svg>
  );
}
