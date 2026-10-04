"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { detectCapabilities, shouldRender3D } from "./support";
import { readPalette } from "./palette";
import { KnightFallback } from "./KnightFallback";

// Three.js só é baixado quando a cena vai de fato aparecer.
const KnightScene = dynamic(() => import("./KnightScene"), { ssr: false });

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const compactQuery = "(max-width: 767px)";

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const subscribeReducedMotion = subscribeMedia(reducedMotionQuery);
const subscribeCompact = subscribeMedia(compactQuery);

export function HeroVisual() {
  // null no servidor: ainda não sabemos se o aparelho aguenta o 3D.
  const capable = useSyncExternalStore(
    subscribeReducedMotion,
    () => shouldRender3D(detectCapabilities()),
    () => null,
  );
  const compact = useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  );
  const theme = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme ?? "dark",
    () => "dark",
  );
  const palette = useMemo(
    () => (capable ? readPalette(theme) : null),
    [capable, theme],
  );

  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="relative size-full">
      {capable === false && <KnightFallback />}
      {capable && palette && (
        <div className="absolute inset-0 animate-[fade-in_1.6s_ease-out_both]">
          <KnightScene palette={palette} active={visible} compact={compact} />
        </div>
      )}
    </div>
  );
}
