import { useId, type ReactNode } from "react";
import type { ArtKind } from "@/lib/commerce/types";

/**
 * Placeholder product photography: an editorial studio-shot illustration per
 * product type. Replace by setting `src` on a product image; ProductImage
 * renders the real photo instead.
 */

const C = {
  body: "#262626",
  bodyHi: "#333",
  edge: "#5b5650",
  bone: "#e6e1da",
  acid: "#c8ff2e",
  violet: "#8b7cf0",
  glass: "rgba(255,255,255,0.07)",
};

const stroke = { stroke: C.edge, strokeWidth: 1.5 } as const;

function Cartridge({ x = 0, r = 0, o = 1, s = 1 }: { x?: number; r?: number; o?: number; s?: number }) {
  return (
    <g transform={`translate(${x} 0) rotate(${r} 200 250) translate(200 250) scale(${s}) translate(-200 -250)`} opacity={o}>
      <rect x="166" y="96" width="68" height="28" rx="4" fill={C.bone} />
      <rect x="166" y="118" width="68" height="4" fill="#bdb7ae" />
      <rect x="170" y="124" width="60" height="214" rx="6" fill={C.body} {...stroke} />
      <rect x="170" y="146" width="60" height="7" fill={C.acid} />
      <rect x="178" y="190" width="44" height="120" rx="3" fill={C.glass} />
      <line x1="200" y1="196" x2="200" y2="380" stroke="#8d877f" strokeWidth="2" />
      <path d="M176 338h48l-14 46h-20z" fill={C.bodyHi} {...stroke} />
      <line x1="200" y1="384" x2="200" y2="404" stroke={C.bone} strokeWidth="1.5" />
      {[214, 232, 250, 268, 286].map((y) => (
        <line key={y} x1="222" y1={y} x2="228" y2={y} stroke="#4a4640" />
      ))}
    </g>
  );
}

function Grip({ alu = false }: { alu?: boolean }) {
  const fill = alu ? "#2e2e2e" : "#1f1f1f";
  return (
    <g transform="rotate(-14 200 250)">
      <rect x="162" y="80" width="76" height="40" rx="6" fill={C.bodyHi} {...stroke} />
      <rect x="160" y="120" width="80" height="210" rx="12" fill={fill} {...stroke} />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1="166" x2="234" y1={150 + i * 9} y2={150 + i * 9} stroke="#3c3a37" strokeWidth="2" />
      ))}
      <rect x="160" y="128" width="80" height="6" fill={C.acid} />
      <path d="M168 330h64l-18 56h-28z" fill={C.bodyHi} {...stroke} />
      <circle cx="200" cy="386" r="4" fill="#0b0b0b" />
    </g>
  );
}

function Tube() {
  return (
    <g transform="rotate(-10 200 250)">
      <rect x="192" y="40" width="16" height="130" rx="3" fill="#3a3a3a" {...stroke} />
      <rect x="172" y="160" width="56" height="160" rx="8" fill={C.body} {...stroke} />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="176" x2="224" y1={176 + i * 10} y2={176 + i * 10} stroke="#3c3a37" strokeWidth="2" />
      ))}
      <rect x="172" y="168" width="56" height="5" fill={C.acid} />
      <path d="M180 320h40l-12 90h-16z" fill="rgba(255,255,255,0.12)" {...stroke} />
      <line x1="200" y1="330" x2="200" y2="420" stroke={C.bone} strokeWidth="1.5" />
    </g>
  );
}

function Stencil() {
  return (
    <g>
      <rect x="110" y="120" width="190" height="250" fill="#d7d1c8" transform="rotate(-8 200 250)" />
      <rect x="110" y="120" width="190" height="250" fill="#f0c94a" opacity=".9" transform="rotate(-3 200 250)" />
      <g transform="rotate(4 200 250)">
        <rect x="104" y="116" width="196" height="256" fill="#efebe5" />
        <g fill="none" stroke={C.violet} strokeWidth="2.2" strokeLinecap="round">
          <path d="M202 150v150" />
          <path d="M184 168h36M188 300l14 30 14-30" />
          <path d="M202 190c-30 10-38 40-22 58s46 6 44-22-30-34-46-14" />
          <path d="M150 260c20-6 34 4 40 22M254 260c-20-6-34 4-40 22" />
          <circle cx="202" cy="150" r="9" />
        </g>
        <text x="116" y="360" fill="#9a958e" fontSize="9" fontFamily="var(--font-jetbrains), monospace" letterSpacing="2">
          THERMAL · 4-PLY
        </text>
      </g>
    </g>
  );
}

function Bottle() {
  return (
    <g>
      <rect x="186" y="112" width="28" height="40" fill="#1e1e1e" {...stroke} />
      <path d="M180 108h40v-14h40v10h-20v8" fill={C.bone} />
      <rect x="176" y="150" width="48" height="26" rx="4" fill={C.bodyHi} {...stroke} />
      <rect x="146" y="174" width="108" height="210" rx="18" fill={C.body} {...stroke} />
      <rect x="156" y="220" width="88" height="120" fill={C.bone} />
      <rect x="156" y="220" width="88" height="8" fill={C.acid} />
      <text x="200" y="300" textAnchor="middle" fill="#0b0b0b" fontSize="44" fontFamily="var(--font-anton), Impact, sans-serif">
        GEL
      </text>
      <text x="200" y="324" textAnchor="middle" fill="#3a3a3a" fontSize="8" fontFamily="var(--font-jetbrains), monospace" letterSpacing="1.5">
        STENCIL TRANSFER
      </text>
    </g>
  );
}

function RollPaper() {
  return (
    <g>
      <path d="M130 210h140v170H130z" fill="#efebe5" transform="skewY(4)" />
      <rect x="120" y="150" width="160" height="70" rx="35" fill="#e6e1da" />
      <ellipse cx="120" cy="185" rx="16" ry="35" fill="#cfc9c0" />
      <ellipse cx="120" cy="185" rx="6" ry="13" fill="#0b0b0b" />
      <g stroke={C.violet} strokeWidth="2" fill="none" opacity=".8">
        <path d="M160 280c20-30 60-30 80 0s-20 60-40 40" />
      </g>
    </g>
  );
}

function Marker() {
  return (
    <g transform="rotate(-30 200 250)">
      <rect x="186" y="80" width="28" height="90" rx="4" fill={C.violet} />
      <rect x="186" y="164" width="28" height="200" rx="4" fill={C.bone} />
      <rect x="186" y="200" width="28" height="6" fill={C.acid} />
      <path d="M190 364h20l-6 30h-8z" fill="#3a3a3a" />
      <rect x="236" y="90" width="22" height="300" fill="none" stroke={C.edge} />
      {Array.from({ length: 29 }, (_, i) => (
        <line key={i} x1="236" x2={i % 5 === 0 ? 248 : 242} y1={100 + i * 10} y2={100 + i * 10} stroke={C.edge} />
      ))}
    </g>
  );
}

function Cord({ clip = false }: { clip?: boolean }) {
  return (
    <g>
      <path
        d="M130 120c60-10 120 20 110 60s-110 20-100 70 120 30 120 80-90 40-100 0 70-50 110-30"
        fill="none"
        stroke="#2c2c2c"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M130 120c60-10 120 20 110 60s-110 20-100 70 120 30 120 80-90 40-100 0 70-50 110-30"
        fill="none"
        stroke="#4a4640"
        strokeWidth="2"
        strokeLinecap="round"
        transform="translate(-2 -3)"
      />
      <rect x="96" y="108" width="40" height="22" rx="4" fill={C.bone} />
      <rect x="80" y="114" width="18" height="10" fill="#c9a24a" />
      {clip ? (
        <path d="M290 324l40-14 8 10-36 20z" fill="#bdb7ae" />
      ) : (
        <>
          <rect x="280" y="318" width="40" height="22" rx="4" fill={C.bone} transform="rotate(10 300 329)" />
          <rect x="318" y="322" width="18" height="10" fill="#c9a24a" transform="rotate(10 300 329)" />
        </>
      )}
      <rect x="110" y="112" width="6" height="14" fill={C.acid} />
    </g>
  );
}

function Rubber() {
  const rings = [
    [170, 200, 46],
    [250, 230, 34],
    [190, 300, 38],
    [260, 320, 24],
    [140, 300, 20],
  ];
  return (
    <g>
      {rings.map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1d1d1d" strokeWidth="14" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={i === 1 ? C.acid : "#3a3733"} strokeWidth={i === 1 ? 3 : 2} strokeDasharray="40 260" />
        </g>
      ))}
    </g>
  );
}

function Pedal() {
  return (
    <g>
      <path d="M120 340l40-160h80l40 160z" fill={C.body} {...stroke} />
      <path d="M150 300l20-100h60l20 100z" fill="#303030" transform="rotate(-4 200 250)" {...stroke} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1="166" x2="234" y1={216 + i * 10} y2={216 + i * 10} stroke="#3e3b37" strokeWidth="2" />
      ))}
      <rect x="120" y="340" width="160" height="10" fill="#151515" />
      <path d="M200 180c0-40 60-40 80-80" fill="none" stroke="#2c2c2c" strokeWidth="8" strokeLinecap="round" />
      <rect x="150" y="330" width="100" height="4" fill={C.acid} />
    </g>
  );
}

function Adapter() {
  return (
    <g transform="rotate(-20 200 250)">
      <rect x="130" y="236" width="46" height="28" rx="4" fill={C.bone} />
      <rect x="112" y="244" width="20" height="12" fill="#c9a24a" />
      <path d="M176 250c30 0 20-30 50-30s20 30 50 30" fill="none" stroke="#2c2c2c" strokeWidth="10" strokeLinecap="round" />
      <rect x="276" y="236" width="46" height="28" rx="4" fill={C.bodyHi} {...stroke} />
      <circle cx="322" cy="250" r="6" fill="#0b0b0b" stroke="#c9a24a" strokeWidth="2" />
      <rect x="140" y="236" width="6" height="28" fill={C.acid} />
    </g>
  );
}

function Film() {
  return (
    <g>
      <path d="M150 190h100v190H150z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
      {[250, 315].map((y) => (
        <line key={y} x1="150" x2="250" y1={y} y2={y} stroke="rgba(255,255,255,0.35)" strokeDasharray="4 4" />
      ))}
      <rect x="130" y="130" width="140" height="70" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" />
      <ellipse cx="130" cy="165" rx="14" ry="35" fill="#cfc9c0" opacity=".5" />
      <ellipse cx="130" cy="165" rx="7" ry="16" fill={C.acid} />
      <path d="M160 210l60 0" stroke="rgba(255,255,255,0.4)" strokeWidth="6" strokeLinecap="round" opacity=".4" />
    </g>
  );
}

function Bag() {
  return (
    <g>
      <path d="M150 90h100v260a50 50 0 0 1-100 0z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.35)" />
      <line x1="150" x2="250" y1="110" y2="110" stroke={C.acid} strokeDasharray="6 4" strokeWidth="2" />
      <g transform="rotate(4 200 260)" opacity=".85">
        <rect x="182" y="140" width="36" height="200" rx="16" fill={C.body} {...stroke} />
        <rect x="182" y="170" width="36" height="6" fill="#3a3a3a" />
        <path d="M188 340h24l-8 30h-8z" fill={C.bodyHi} />
      </g>
      <path d="M160 120c4 60 4 160 0 230" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" />
    </g>
  );
}

function Cup() {
  return (
    <g>
      <ellipse cx="200" cy="370" rx="80" ry="14" fill="#1a1a1a" stroke={C.edge} />
      <path d="M140 160h120l-14 200h-92z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <ellipse cx="200" cy="160" rx="60" ry="10" fill="none" stroke="rgba(255,255,255,0.45)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1="236" x2="250" y1={220 + i * 30} y2={220 + i * 30} stroke="rgba(255,255,255,0.4)" />
        </g>
      ))}
      <path d="M150 290h100l-4 66h-92z" fill="rgba(200,255,46,0.12)" />
    </g>
  );
}

function Caps() {
  const caps = [
    [150, 220],
    [220, 200],
    [270, 260],
    [180, 290],
    [250, 330],
    [130, 330],
  ];
  return (
    <g>
      {caps.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x - 26} ${y}h52l-6 50h-40z`} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" />
          <ellipse cx={x} cy={y} rx="26" ry="6" fill={i === 2 ? C.acid : "#151515"} stroke="rgba(255,255,255,0.4)" />
        </g>
      ))}
    </g>
  );
}

function Cover() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${i * -26})`}>
          <path d="M100 340l40-30h160l-40 30z" fill={i === 2 ? "#e6e1da" : i === 1 ? "#cfc9c0" : "#b5afa6"} />
          <path d="M100 340h160v14H100z" fill={i === 2 ? "#bdb7ae" : "#8f8a82"} />
        </g>
      ))}
      <path d="M118 290c20 10 120 10 140 0" stroke={C.acid} strokeWidth="2" fill="none" />
      <path d="M130 200c40-50 120-50 160 0" stroke="#e6e1da" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity=".5" />
    </g>
  );
}

function Bandage() {
  const rolls = [
    [160, 220, "#1c1c1c"],
    [250, 240, C.acid],
    [190, 320, "#1c1c1c"],
  ] as const;
  return (
    <g>
      {rolls.map(([x, y, col], i) => (
        <g key={i}>
          <rect x={x - 40} y={y - 30} width="80" height="60" rx="6" fill={col} stroke={C.edge} />
          <ellipse cx={x} cy={y - 30} rx="40" ry="12" fill={col === C.acid ? "#b4e624" : "#2a2a2a"} stroke={C.edge} />
          <ellipse cx={x} cy={y - 30} rx="14" ry="4" fill="#0b0b0b" />
        </g>
      ))}
      <path d="M290 270c30 20 40 60 10 90" stroke={C.acid} strokeWidth="18" fill="none" opacity=".9" />
    </g>
  );
}

/** Isometric box. Used for kits and for the packaging view of every product. */
function Box({ title, code, kit = false }: { title: string; code: string; kit?: boolean }) {
  return (
    <g>
      {kit && (
        <g opacity=".95">
          <Cartridge x={-30} r={-12} s={0.55} />
          <Cartridge x={10} r={8} s={0.55} />
          <Cartridge x={45} r={22} s={0.5} />
        </g>
      )}
      <path d="M90 200l110-40 110 40-110 40z" fill="#2a2a2a" stroke={C.edge} />
      <path d="M90 200v150l110 40V240z" fill="#1d1d1d" stroke={C.edge} />
      <path d="M310 200v150l-110 40V240z" fill="#151515" stroke={C.edge} />
      <path d="M90 236l110 40v22L90 258z" fill={C.acid} />
      <text
        x="0"
        y="0"
        transform="translate(104 300) skewY(20)"
        fill={C.bone}
        fontSize="26"
        fontFamily="var(--font-anton), Impact, sans-serif"
      >
        {title}
      </text>
      <text
        x="0"
        y="0"
        transform="translate(104 322) skewY(20)"
        fill="#9a958e"
        fontSize="8"
        letterSpacing="1.5"
        fontFamily="var(--font-jetbrains), monospace"
      >
        {code}
      </text>
      <text
        x="0"
        y="0"
        transform="translate(214 280) skewY(-20)"
        fill="#3a3733"
        fontSize="11"
        letterSpacing="3"
        fontFamily="var(--font-jetbrains), monospace"
      >
        STERILE · EO
      </text>
    </g>
  );
}

function Subject({ kind, label, sku }: { kind: ArtKind; label: string; sku: string }) {
  switch (kind) {
    case "cartridge":
      return (
        <>
          <Cartridge x={-70} r={-24} o={0.45} s={0.85} />
          <Cartridge x={70} r={22} o={0.45} s={0.85} />
          <Cartridge r={-4} />
        </>
      );
    case "grip":
      return <Grip alu={label === "ALU"} />;
    case "tube":
      return <Tube />;
    case "stencil":
      return <Stencil />;
    case "bottle":
      return <Bottle />;
    case "roll-paper":
      return <RollPaper />;
    case "marker":
      return <Marker />;
    case "cord":
      return <Cord clip={label === "CLIP"} />;
    case "rubber":
      return <Rubber />;
    case "pedal":
      return <Pedal />;
    case "adapter":
      return <Adapter />;
    case "film":
      return <Film />;
    case "bag":
      return <Bag />;
    case "cup":
      return <Cup />;
    case "caps":
      return <Caps />;
    case "cover":
      return <Cover />;
    case "bandage":
      return <Bandage />;
    case "kit":
      return <Box title={label} code={sku} kit />;
  }
}

export function ProductArt({
  kind,
  label,
  sku = "",
  view = 0,
  alt,
  className = "",
  tone = "dark",
  decorative = false,
  meta = true,
}: {
  kind: ArtKind;
  label: string;
  sku?: string;
  view?: 0 | 1 | 2;
  alt: string;
  className?: string;
  tone?: "dark" | "charcoal";
  decorative?: boolean;
  /** Corner label, SKU and accent tick. Turn off when overlaid by other UI. */
  meta?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const bg = tone === "dark" ? "#141414" : "#1a1a1a";

  let content: ReactNode;
  if (view === 2 && kind !== "kit") {
    content = <Box title={label} code={sku} />;
  } else if (view === 1) {
    content = (
      <g transform="translate(200 250) scale(1.9) translate(-200 -235)">
        <Subject kind={kind} label={label} sku={sku} />
      </g>
    );
  } else {
    content = <Subject kind={kind} label={label} sku={sku} />;
  }

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": alt })}
    >
      {!decorative && <title>{alt}</title>}
      <defs>
        <radialGradient id={`g${uid}`} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#2c2c2c" />
          <stop offset="100%" stopColor={bg} />
        </radialGradient>
        <linearGradient id={`f${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".45" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#g${uid})`} />
      <text
        x="200"
        y="330"
        textAnchor="middle"
        fontSize={label.length > 4 ? 120 : 210}
        fontFamily="var(--font-anton), Impact, sans-serif"
        fill="none"
        stroke="#363636"
        strokeWidth="1.5"
      >
        {label}
      </text>
      {meta && !decorative && view !== 2 && (
        <text x="24" y="458" fill="#e6e1da" fontSize="30" fontFamily="var(--font-anton), Impact, sans-serif">
          {label}
        </text>
      )}
      <ellipse cx="200" cy="430" rx="120" ry="12" fill="#000" opacity=".5" />
      {content}
      <rect width="400" height="500" fill={`url(#f${uid})`} />
      {view === 1 && (
        <g stroke={C.acid} strokeWidth="1.5" fill="none">
          <path d="M24 24h22M24 24v22M376 24h-22M376 24v22M24 476h22M24 476v-22M376 476h-22M376 476v-22" />
        </g>
      )}
      {meta && (
        <>
          <text x="24" y="476" fill="#6b6762" fontSize="10" letterSpacing="2" fontFamily="var(--font-jetbrains), monospace">
            {view === 1 ? "DETAIL ×2" : sku}
          </text>
          <rect x="352" y="470" width="24" height="3" fill={C.acid} />
        </>
      )}
    </svg>
  );
}
