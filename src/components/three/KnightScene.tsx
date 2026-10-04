"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type * as THREE from "three";
import { KnightHelm } from "./KnightHelm";
import { Roses } from "./Roses";
import { Thorns } from "./Thorns";
import { Petals } from "./Petals";
import type { ScenePalette } from "./palette";

type Props = {
  palette: ScenePalette;
  /** false pausa o loop de render (ex.: hero fora da tela). */
  active: boolean;
  /** Versão mais leve para telas pequenas. */
  compact: boolean;
};

export default function KnightScene({ palette, active, compact }: Props) {
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      aria-hidden
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.4], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="pointer-events-none !absolute inset-0"
    >
      <ambientLight intensity={palette.dark ? 0.2 : 0.55} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={palette.dark ? 1.4 : 1.8}
      />
      {/* Luz vermelha rasante: o "sangue" refletido no cromo */}
      <pointLight
        position={[-3.2, -0.5, 2]}
        color={palette.accent}
        intensity={palette.dark ? 9 : 5}
      />

      {/* Reflexos do cromo gerados por painéis de luz — nada é baixado */}
      <Environment
        key={palette.accent}
        resolution={compact ? 64 : 256}
        frames={1}
      >
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 5, 3]}
          scale={[10, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[4.5, 1, 2]}
          scale={[1, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[-4.5, 1, 1]}
          scale={[1, 7, 1]}
        />
        <Lightformer
          form="rect"
          color={palette.accent}
          intensity={6}
          position={[-3, -2, 3]}
          scale={[3, 2, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          position={[0, 0, -6]}
          scale={4}
        />
        {/* Faixa vertical na frente: o brilho clássico do cromo */}
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[2.2, 0.5, 8]}
          scale={[1.4, 8, 1]}
        />
      </Environment>

      <Knight palette={palette} compact={compact} scroll={scroll} />
      <Petals count={compact ? 18 : 42} color={palette.rose} scroll={scroll} />
    </Canvas>
  );
}

type KnightProps = {
  palette: ScenePalette;
  compact: boolean;
  scroll: React.RefObject<number>;
};

function Knight({ palette, compact, scroll }: KnightProps) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const ease = 1 - Math.exp(-delta * 2.5);
    // No mobile não há cursor: um balanço lento substitui o mouse
    const px = compact ? Math.sin(t * 0.35) * 0.6 : pointer.current.x;
    const py = compact ? Math.cos(t * 0.3) * 0.3 : pointer.current.y;
    const s = scroll.current ?? 0;

    const targetY = px * 0.45 + s * 1.4;
    const targetX = py * 0.18 + 0.05;
    g.rotation.y += (targetY - g.rotation.y) * ease;
    g.rotation.x += (targetX - g.rotation.x) * ease;
    g.position.y = 0.3 + Math.sin(t * 0.7) * 0.05;
  });

  return (
    <group ref={group} scale={compact ? 1.05 : 1.15}>
      <KnightHelm compact={compact} />
      <Thorns color={palette.leaf} />
      <Roses palette={palette} compact={compact} />
    </group>
  );
}
