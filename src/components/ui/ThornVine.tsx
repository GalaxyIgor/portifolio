"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Point = { x: number; y: number };
type Sample = Point & { distance: number; angle: number };
type Curve = [Point, Point, Point, Point];

const point = (x: number, y: number): Point => ({ x, y });
const GROWTH_MS = 1450;

/** Pixel geometry keeps leaves proportional on portrait and landscape frames. */
function makeBranch(width: number, height: number, right: boolean) {
  const edge = right ? 16 : 13;
  const x = (value: number) => (right ? width - value : value);
  const p = (a: number, b: number) => point(x(a), b);
  const bend = right ? -1 : 1;
  const start = p(width * (right ? 0.47 : 0.54), height - 13);
  const curves: Curve[] = [];
  let previous = start;
  function curve(a: Point, b: Point, end: Point) {
    curves.push([previous, a, b, end]);
    previous = end;
  }

  curve(
    p(width * 0.35, height - 23),
    p(width * 0.25, height - 6),
    p(46, height - 15),
  );
  curve(p(17, height - 23), p(edge - 5, height - 10), p(edge, height - 49));
  curve(
    p(edge + 9, height * 0.76),
    p(edge - 8, height * 0.72),
    p(edge + bend * 3, height * 0.63),
  );
  curve(
    p(edge + bend * 12, height * 0.54),
    p(edge - bend * 8, height * 0.5),
    p(edge + 1, height * 0.41),
  );
  curve(
    p(edge + 7, height * 0.32),
    p(edge - 7, height * 0.23),
    p(edge + 2, 49),
  );
  curve(p(edge + 7, 24), p(11, 10), p(44, 14));
  curve(
    p(width * 0.23, right ? 7 : 22),
    p(width * 0.32, right ? 24 : 5),
    p(width * (right ? 0.39 : 0.43), 15),
  );
  curve(p(width * 0.48, 8), p(width * 0.48, 31), p(width * 0.43, 25));

  const samples: Sample[] = [];
  let distance = 0;
  for (const [a, b, c, d] of curves) {
    for (let step = samples.length ? 1 : 0; step <= 20; step++) {
      const t = step / 20;
      const u = 1 - t;
      const px =
        u ** 3 * a.x +
        3 * u ** 2 * t * b.x +
        3 * u * t ** 2 * c.x +
        t ** 3 * d.x;
      const py =
        u ** 3 * a.y +
        3 * u ** 2 * t * b.y +
        3 * u * t ** 2 * c.y +
        t ** 3 * d.y;
      const dx =
        3 * u ** 2 * (b.x - a.x) +
        6 * u * t * (c.x - b.x) +
        3 * t ** 2 * (d.x - c.x);
      const dy =
        3 * u ** 2 * (b.y - a.y) +
        6 * u * t * (c.y - b.y) +
        3 * t ** 2 * (d.y - c.y);
      const last = samples.at(-1);
      if (last) distance += Math.hypot(px - last.x, py - last.y);
      samples.push({ x: px, y: py, distance, angle: Math.atan2(dy, dx) });
    }
  }

  const contour = (side: number) =>
    samples.map((sample, index) => {
      const progress = sample.distance / distance;
      const radius =
        (2.8 * (1 - progress) ** 0.8 + 0.18) *
        (1 + Math.sin(index * 1.7) * 0.075);
      return `${(sample.x - Math.sin(sample.angle) * radius * side).toFixed(2)},${(sample.y + Math.cos(sample.angle) * radius * side).toFixed(2)}`;
    });
  const outline = `M${contour(1).join("L")}L${contour(-1).reverse().join("L")}Z`;
  const center = `M${start.x},${start.y}${curves.map(([, b, c, d]) => `C${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`).join("")}`;
  const at = (progress: number) =>
    samples.find((sample) => sample.distance >= distance * progress) ??
    samples[samples.length - 1];

  return { outline, center, at, right };
}

function growthStyle(progress: number, right: boolean): CSSProperties {
  return {
    "--growth-delay": `${Math.round(progress * GROWTH_MS + (right ? 100 : 0))}ms`,
  } as CSSProperties;
}

// Math.atan2 can differ in its last digits between the server and the browser.
function attachmentTransform(anchor: Sample, scale = 1, side = 1, tilt = 0) {
  const angle = ((anchor.angle * 180) / Math.PI + tilt).toFixed(3);
  return `translate(${anchor.x.toFixed(3)} ${anchor.y.toFixed(3)}) rotate(${angle}) scale(${scale.toFixed(3)} ${(scale * side).toFixed(3)})`;
}

export function ThornVine() {
  const id = useId();
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 300, height: 360 });

  useEffect(() => {
    const element = svg.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (!width || !height) return;
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const branches = useMemo(
    () =>
      [false, true].map((right) => makeBranch(size.width, size.height, right)),
    [size],
  );

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      focusable="false"
      className="thorn-vine"
      viewBox={`0 0 ${size.width} ${size.height}`}
    >
      <defs>
        <linearGradient id={`${id}-bark`} x1="0" y1="1" x2="0.8" y2="0">
          <stop className="vine-bark-dark" offset="0" />
          <stop className="vine-bark-mid" offset="0.35" />
          <stop className="vine-bark-light" offset="0.7" />
          <stop className="vine-bark-mid" offset="1" />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="0.6">
          <stop className="vine-leaf-dark" offset="0" />
          <stop className="vine-leaf-mid" offset="0.48" />
          <stop className="vine-leaf-light" offset="0.52" />
          <stop className="vine-leaf-mid" offset="1" />
        </linearGradient>
        <linearGradient id={`${id}-thorn`} x1="0" y1="1" x2="0.4" y2="0">
          <stop className="vine-bark-mid" offset="0" />
          <stop className="vine-thorn-tip" offset="1" />
        </linearGradient>
        <radialGradient id={`${id}-rose`} cx="32%" cy="25%" r="75%">
          <stop className="vine-rose-light" offset="0" />
          <stop className="vine-rose-mid" offset="0.48" />
          <stop className="vine-rose-dark" offset="1" />
        </radialGradient>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0.8" y2="1">
          <stop className="vine-rose-light" offset="0" />
          <stop className="vine-rose-mid" offset="0.32" />
          <stop className="vine-rose-dark" offset="1" />
        </linearGradient>
        {branches.map((branch, index) => (
          <mask
            key={index}
            id={`${id}-growth-${index}`}
            maskUnits="userSpaceOnUse"
            x="-8"
            y="-8"
            width={size.width + 16}
            height={size.height + 16}
          >
            <path
              className="thorn-vine-growth"
              d={branch.center}
              pathLength="1"
              stroke="white"
              strokeWidth="18"
              fill="none"
              style={growthStyle(0, branch.right)}
            />
          </mask>
        ))}
      </defs>
      {branches.map((branch, index) => (
        <g key={index} className="thorn-vine-branch">
          <g mask={`url(#${id}-growth-${index})`}>
            <path
              className="thorn-vine-stem"
              d={branch.outline}
              fill={`url(#${id}-bark)`}
            />
            <path
              className="thorn-vine-ridge"
              d={branch.center}
              transform="translate(-0.65 -0.5)"
            />
            <path className="thorn-vine-bark" d={branch.center} />
          </g>
          {[
            0.06, 0.14, 0.22, 0.29, 0.37, 0.44, 0.52, 0.6, 0.67, 0.75, 0.83,
            0.91,
          ].map((position, thornIndex) => {
            const progress = position + (branch.right ? 0.017 : 0);
            const anchor = branch.at(progress);
            const side = thornIndex % 3 === 0 ? -1 : 1;
            const scale = (0.95 - progress * 0.35) * (thornIndex % 2 ? 0.8 : 1);
            return (
              <g
                key={position}
                transform={attachmentTransform(anchor, scale, side)}
              >
                <g
                  className="thorn-vine-detail"
                  style={growthStyle(progress, branch.right)}
                >
                  <path
                    className="thorn-vine-thorn"
                    d="M-4 1C-1-1 1-3 3-11 4-6 4-2 7 1Q1 3-4 1Z"
                    fill={`url(#${id}-thorn)`}
                  />
                  <path className="thorn-vine-thorn-edge" d="M-2 0Q2-2 3-8" />
                </g>
              </g>
            );
          })}
          {[0.17, 0.33, 0.49, 0.64, 0.79, 0.9].map((position, leafIndex) => {
            const progress = position + (branch.right ? 0.035 : 0);
            const anchor = branch.at(progress);
            const scale = (leafIndex % 2 ? 0.76 : 0.94) * (1 - progress * 0.25);
            const side = (leafIndex % 2 ? -1 : 1) * (branch.right ? -1 : 1);
            return (
              <g
                key={position}
                transform={attachmentTransform(anchor, scale, side, -12)}
              >
                <g
                  className="thorn-vine-detail"
                  style={growthStyle(progress, branch.right)}
                >
                  <path className="thorn-vine-petiole" d="M0 0Q4-2 6-7" />
                  <path
                    className="thorn-vine-leaf"
                    d="M6-6C1-11 4-19 12-26L12-22 15-21 14-18 17-16 15-13 16-11C13-7 10-5 6-6Z"
                    fill={`url(#${id}-leaf)`}
                  />
                  <path
                    className="thorn-vine-vein"
                    d="M5-5Q10-13 12-23M8-11 5-15M10-15 8-19M8-11 13-12M10-16 13-17"
                  />
                </g>
              </g>
            );
          })}
          {[0.4, 0.72].map((progress, tendrilIndex) => {
            const anchor = branch.at(progress);
            return (
              <g
                key={progress}
                transform={attachmentTransform(
                  anchor,
                  1,
                  tendrilIndex ? -1 : 1,
                )}
              >
                <path
                  className="thorn-vine-tendril"
                  d="M0 0C9-4 6-19 16-20 27-21 24-8 17-11 12-13 17-18 19-15"
                  pathLength="1"
                  style={growthStyle(progress, branch.right)}
                />
              </g>
            );
          })}
          {(branch.right ? [0.25, 0.82] : [0.18, 0.68]).map(
            (progress, roseIndex) => {
              const anchor = branch.at(progress);
              return (
                <g
                  key={progress}
                  transform={attachmentTransform(
                    anchor,
                    roseIndex ? 0.82 : 1,
                    branch.right ? -1 : 1,
                    roseIndex ? 18 : -16,
                  )}
                >
                  <g
                    className="thorn-vine-detail thorn-vine-flower"
                    style={growthStyle(progress, branch.right)}
                  >
                    <path className="thorn-vine-petiole" d="M0 0Q4-4 8-7" />
                    <g transform="translate(9 -10)">
                      <path
                        className="thorn-vine-calyx"
                        d="M-3 5-13 9-9 0-15-6-5-6-1-14 5-7 14-9 10 0 14 7 5 6 0 13Z"
                      />
                      <path
                        className="thorn-vine-rose-petal"
                        fill={`url(#${id}-rose)`}
                        d="M-11-2C-15-8-8-14-2-11 3-16 11-10 10-6 17-3 14 5 9 7 6 14-2 13-5 9-12 11-16 3-11-2Z"
                      />
                      <path
                        className="thorn-vine-rose-petal"
                        fill={`url(#${id}-petal)`}
                        d="M-10-3C-10-10-3-11 1-7 7-10 12-4 8 1 11 6 4 11 0 7-7 10-12 3-7-1Z"
                      />
                      <path
                        className="thorn-vine-rose-petal"
                        fill={`url(#${id}-rose)`}
                        d="M-6-3C-3-9 4-6 5-3 10 1 4 7 0 4-5 6-9 1-6-3Z"
                      />
                      <path
                        className="thorn-vine-rose-fold"
                        d="M-10-2Q-8 4-3 4M-2-10Q-1-5 5-5M10-4Q5-3 5 2M-5 9Q-1 6 1 7M-4-3C0-6 5-2 2 1-1 4-4 0-1-1"
                      />
                      <path
                        className="thorn-vine-rose-heart"
                        d="M-1-2C3-3 4 1 1 2-1 1-2 0-1-2Z"
                      />
                      <path
                        className="thorn-vine-rose-highlight"
                        d="M-10-6Q-8-10-5-9M1-8Q5-9 7-6M-4-4Q-1-6 2-4M-9 4Q-7 7-4 7"
                      />
                    </g>
                  </g>
                </g>
              );
            },
          )}
        </g>
      ))}
    </svg>
  );
}
