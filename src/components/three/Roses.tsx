"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildRoseGeometry } from "./roseGeometry";
import type { ScenePalette } from "./palette";

type Bloom = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  delay: number;
};

// Buquê na base do elmo, mais denso na frente
const BLOOMS: Bloom[] = [
  {
    position: [0.15, -1.38, 1.0],
    rotation: [0.55, 0.1, -0.1],
    scale: 1.15,
    delay: 0.5,
  },
  {
    position: [-0.85, -1.25, 0.72],
    rotation: [0.45, -0.5, 0.35],
    scale: 0.95,
    delay: 0.75,
  },
  {
    position: [0.98, -1.2, 0.55],
    rotation: [0.4, 0.6, -0.45],
    scale: 0.9,
    delay: 0.9,
  },
  {
    position: [-0.35, -1.62, 1.18],
    rotation: [0.9, -0.2, 0.25],
    scale: 0.7,
    delay: 1.1,
  },
  {
    position: [0.72, -1.6, 1.05],
    rotation: [0.95, 0.35, -0.2],
    scale: 0.62,
    delay: 1.25,
  },
  {
    position: [-1.08, 0.95, 0.35],
    rotation: [0.2, -0.9, 0.6],
    scale: 0.55,
    delay: 1.45,
  },
];

type Props = { palette: ScenePalette; compact: boolean };

export function Roses({ palette, compact }: Props) {
  const geometry = useMemo(
    () => buildRoseGeometry(palette, compact ? 18 : 28),
    [palette, compact],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  const blooms = compact ? BLOOMS.slice(0, 4) : BLOOMS;

  return (
    <group>
      {blooms.map((bloom, i) => (
        <RoseInstance key={i} bloom={bloom} geometry={geometry} />
      ))}
    </group>
  );
}

function RoseInstance({
  bloom,
  geometry,
}: {
  bloom: Bloom;
  geometry: THREE.BufferGeometry;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  // Entrada: cada rosa "abre" crescendo a partir do botão, em sequência
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const grow = THREE.MathUtils.smoothstep(t, bloom.delay, bloom.delay + 1.4);
    const breathe = 1 + Math.sin(t * 0.8 + bloom.delay * 4) * 0.015;
    m.scale.setScalar(bloom.scale * (0.15 + 0.85 * grow) * breathe);
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={bloom.position}
      rotation={bloom.rotation}
      scale={0}
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.62}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
