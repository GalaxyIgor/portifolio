/**
 * Versão estática do elmo com rosas, em SVG. Aparece sem WebGL,
 * com movimento reduzido ou em aparelhos modestos.
 */
const roses = [
  { x: 205, y: 404, r: 34 },
  { x: 140, y: 392, r: 28 },
  { x: 268, y: 390, r: 27 },
  { x: 172, y: 428, r: 20 },
];

const holes = Array.from({ length: 24 }, (_, i) => {
  const side = i < 12 ? -1 : 1;
  const k = i % 12;
  return {
    x: 200 + side * (26 + (k % 3) * 15),
    y: 268 + Math.floor(k / 3) * 17,
  };
});

export function KnightFallback() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 460"
      className="absolute inset-0 m-auto h-full max-w-full"
    >
      <defs>
        <linearGradient id="chrome" x1="0" x2="1">
          <stop offset="0" stopColor="#3b3d42" />
          <stop offset="0.22" stopColor="#e9ebee" />
          <stop offset="0.38" stopColor="#8b8f96" />
          <stop offset="0.62" stopColor="#d5d8dc" />
          <stop offset="0.8" stopColor="#5d6066" />
          <stop offset="1" stopColor="#1d1e21" />
        </linearGradient>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0" stopColor="#6b5222" />
          <stop offset="0.35" stopColor="#e3c27a" />
          <stop offset="1" stopColor="#5e4619" />
        </linearGradient>
        <radialGradient id="petal">
          <stop offset="0" stopColor="var(--rose-deep)" />
          <stop offset="1" stopColor="var(--rose)" />
        </radialGradient>
      </defs>

      {/* Casco */}
      <path
        d="M112 392 L104 214 C104 120 148 64 200 58 C252 64 296 120 296 214 L288 392 Z"
        fill="url(#chrome)"
      />
      {/* Banda da testa e reforço vertical */}
      <rect x="104" y="196" width="192" height="15" fill="url(#brass)" />
      <rect x="193" y="211" width="14" height="181" fill="url(#brass)" />
      {/* Fendas dos olhos */}
      <rect x="122" y="226" width="64" height="10" rx="2" fill="#050505" />
      <rect x="214" y="226" width="64" height="10" rx="2" fill="#050505" />
      {holes.map((h, i) => (
        <circle key={i} cx={h.x} cy={h.y} r="2.6" fill="#050505" />
      ))}
      <rect x="110" y="388" width="180" height="8" fill="url(#brass)" />

      {/* Folhas e rosas */}
      <path
        d="M95 420 C120 380 150 380 165 400 C140 405 120 415 95 420Z"
        fill="var(--leaf)"
      />
      <path
        d="M318 412 C290 376 262 378 248 396 C272 400 292 408 318 412Z"
        fill="var(--leaf)"
      />
      {roses.map((rose, i) => (
        <g key={i} transform={`translate(${rose.x} ${rose.y})`}>
          <circle r={rose.r} fill="url(#petal)" />
          <path
            d={`M0 0 m-${rose.r * 0.2} 0 a${rose.r * 0.2} ${rose.r * 0.2} 0 1 1 ${rose.r * 0.4} 0 a${rose.r * 0.45} ${rose.r * 0.45} 0 1 1 -${rose.r * 0.85} 0 a${rose.r * 0.7} ${rose.r * 0.7} 0 1 1 ${rose.r * 1.35} 0`}
            fill="none"
            stroke="var(--rose-deep)"
            strokeWidth="2"
          />
        </g>
      ))}
    </svg>
  );
}
