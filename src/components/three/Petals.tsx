"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { petalGeometry } from "./roseGeometry";

type Props = {
  count: number;
  color: string;
  /** 0–1: quanto o usuário já rolou. Acelera a queda. */
  scroll: React.RefObject<number>;
};

type Petal = {
  x: number;
  y: number;
  z: number;
  speed: number;
  sway: number;
  phase: number;
  spin: THREE.Euler;
  spinSpeed: [number, number, number];
};

const TOP = 3.6;
const BOTTOM = -3.4;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Pétalas soltas caindo devagar, desenhadas com um único InstancedMesh. */
export function Petals({ count, color, scroll }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => petalGeometry(0.13, 0.15, 0.05, 0.03), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: random(-3.2, 3.2),
        y: random(BOTTOM, TOP),
        z: random(-1.5, 2.2),
        speed: random(0.12, 0.3),
        sway: random(0.15, 0.45),
        phase: random(0, Math.PI * 2),
        spin: new THREE.Euler(random(0, 6), random(0, 6), random(0, 6)),
        spinSpeed: [random(-1, 1), random(-1, 1), random(-1, 1)],
      })),
    [count],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const boost = 1 + (scroll.current ?? 0) * 2.5;
    const dt = Math.min(delta, 0.05);

    petals.forEach((p, i) => {
      p.y -= p.speed * boost * dt;
      if (p.y < BOTTOM) {
        p.y = TOP;
        p.x = random(-3.2, 3.2);
      }
      p.spin.x += p.spinSpeed[0] * dt;
      p.spin.y += p.spinSpeed[1] * dt;
      p.spin.z += p.spinSpeed[2] * dt;
      dummy.position.set(p.x + Math.sin(t * 0.6 + p.phase) * p.sway, p.y, p.z);
      dummy.rotation.copy(p.spin);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.6}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
