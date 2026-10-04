"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { detectCapabilities, shouldRender3D } from "./support";
import { HERO_IMAGE } from "./heroImage";

// Three.js só é baixado quando a cena vai de fato aparecer.
const ParallaxScene = dynamic(() => import("./ParallaxScene"), { ssr: false });

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const compactQuery = "(max-width: 767px)";

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

const subscribeReducedMotion = subscribeMedia(reducedMotionQuery);
const subscribeCompact = subscribeMedia(compactQuery);

type Props = { name: string; imageAlt: string };

/**
 * Fundo do hero. Começa como imagem estática + <h1> em HTML (rápido e sem JS).
 * Em aparelhos capazes, o parallax WebGL assume quando o primeiro frame fica pronto;
 * o <h1> continua no DOM (só fica transparente) para leitores de tela e SEO.
 */
export function HeroVisual({ name, imageAlt }: Props) {
  // null no servidor: ainda não sabemos se o aparelho aguenta o WebGL.
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

  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const showScene = Boolean(capable) && ready;

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [fx, fy] = HERO_IMAGE.focus;

  return (
    <div
      ref={container}
      className="absolute inset-0 overflow-hidden bg-[#0a0a0a]"
    >
      <Image
        src={HERO_IMAGE.src}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: `${fx * 100}% ${(1 - fy) * 100}%` }}
      />
      {/* Mesma vinheta e transição do shader, para a troca não pular */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 75% at 50% 45%, transparent 40%, rgb(10 10 10 / 0.55)), linear-gradient(to top, #0a0a0a, transparent 28%)",
        }}
      />

      {capable && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${showScene ? "opacity-100" : "opacity-0"}`}
        >
          <ParallaxScene
            name={name}
            active={visible}
            compact={compact}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      <h1
        id="hero-title"
        className={`absolute inset-x-0 top-[34%] -translate-y-1/2 text-center font-display text-[clamp(6rem,30vw,24rem)] leading-none text-[#ece6da] transition-opacity duration-700 select-none portrait:top-[20%] ${showScene ? "opacity-0" : "opacity-100"}`}
      >
        {name}
      </h1>
    </div>
  );
}
