import type { CSSProperties } from "react";

const thorns = [
  ["M86 343Q78 337 72 331L77 344Z", 70],
  ["M35 329Q21 329 13 336L25 320Z", 120],
  ["M17 282Q25 276 33 263L19 271Z", 180],
  ["M22 232Q12 230 5 217L21 222Z", 230],
  ["M15 184Q26 177 30 164L17 173Z", 290],
  ["M21 130Q10 125 6 113L22 118Z", 350],
  ["M18 76Q29 71 34 58L19 64Z", 410],
  ["M57 18Q61 29 72 34L66 18Z", 470],
  ["M107 16Q113 7 127 5L117 19Z", 530],
] as const;

/** Gravura vetorial: os dois ramos crescem da base e abraçam a moldura. */
export function ThornVine() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="thorn-vine"
      viewBox="0 0 300 360"
      preserveAspectRatio="none"
    >
      {[false, true].map((mirrored) => (
        <g
          key={String(mirrored)}
          transform={mirrored ? "translate(300 0) scale(-1 1)" : undefined}
        >
          <path
            className="thorn-vine-stem"
            pathLength="1"
            d="M151 345C120 337 96 352 67 342S15 341 17 307C20 281 11 268 20 247S11 207 17 181S25 147 19 126S11 83 19 62C26 42 12 25 34 19S72 24 93 17S121 24 137 17C151 10 151 25 141 25"
          />
          {thorns.map(([d, delay]) => (
            <path
              key={d}
              d={d}
              className="thorn-vine-thorn"
              style={
                {
                  "--thorn-delay": `${delay + (mirrored ? 45 : 0)}ms`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
