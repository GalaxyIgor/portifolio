"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  count: number;
  /** 0–1: quanto o usuário já rolou. Acelera a queda. */
  scroll: React.RefObject<number>;
  /** Largura visível da cena, para espalhar as pétalas pela tela toda. */
  spread: number;
};

type Petal = {
  x: number;
  y: number;
  z: number;
  scale: number;
  fall: number;
  flutter: number; // frequência do balanço
  glide: number; // quanto plana de lado
  phase: number;
  tilt: [number, number]; // inclinação base em x e z
  spin: number; // giro lento em torno do eixo vertical
  spinSpeed: number;
};

const TOP = 3.4;
const BOTTOM = -3.2;
const WIND = 0.1;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Pétala de rosa: base estreita, corpo largo e topo arredondado.
 * Malha subdividida para dobrar em concha (bordas para dentro) e virar a ponta.
 * Cor por vértice: base escura → carmim, bordas um pouco mais escuras.
 */
function petalGeometry(width: number, height: number) {
  const geo = new THREE.PlaneGeometry(width, height, 8, 12);
  geo.translate(0, height / 2, 0);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const base = new THREE.Color("#2a0306");
  const body = new THREE.Color("#9c0f1d");
  const tip = new THREE.Color("#d42a3a");
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i) / (width / 2); // -1..1
    const ny = pos.getY(i) / height; // 0..1

    // Contorno: abre rápido a partir da base e fecha num arco no topo
    const profile =
      ny < 0.62
        ? 0.22 + 0.78 * Math.sin(((ny / 0.62) * Math.PI) / 2)
        : Math.sqrt(Math.max(0, 1 - ((ny - 0.62) / 0.38) ** 2));
    const x = pos.getX(i) * profile;

    // Concha: bordas para dentro; ponta levemente virada para fora
    const z = -0.22 * width * nx * nx * (0.4 + ny) + 0.18 * height * ny ** 3;
    pos.setXYZ(i, x, pos.getY(i), z);

    c.copy(base).lerp(body, THREE.MathUtils.smoothstep(ny, 0, 0.45));
    c.lerp(tip, THREE.MathUtils.smoothstep(ny, 0.55, 1) * 0.6);
    c.multiplyScalar(1 - 0.28 * nx * nx);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function spawn(spread: number, y: number): Petal {
  const z = random(-1.4, 1);
  return {
    x: random(-spread / 2, spread / 2),
    y,
    z,
    // Mais perto da câmera = um pouco maior, sem exagerar
    scale: random(0.75, 1.25) * (1 + Math.max(0, z) * 0.15),
    fall: random(0.16, 0.3),
    flutter: random(1.1, 2),
    glide: random(0.12, 0.3),
    phase: random(0, Math.PI * 2),
    tilt: [random(-0.6, 0.6), random(-0.6, 0.6)],
    spin: random(0, Math.PI * 2),
    spinSpeed: random(-0.6, 0.6),
  };
}

/** Pétalas soltas caindo como folhas, desenhadas com um único InstancedMesh. */
export function Petals({ count, scroll, spread }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const pointerX = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => petalGeometry(0.16, 0.19), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, () => spawn(spread, random(BOTTOM, TOP))),
    [count, spread],
  );

  // Variação de tom por pétala (multiplica o gradiente): umas mais escuras,
  // outras puxando para o rosa. Antes do primeiro frame, para o shader já
  // compilar com cor por instância.
  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const light = random(0.7, 1.2);
      c.setRGB(light, light * random(0.8, 1.05), light * random(0.85, 1.1));
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const boost = 1 + (scroll.current ?? 0) * 2;
    const wind = WIND + pointerX.current * 0.08;
    const edge = spread / 2 + 0.4;

    petals.forEach((p, i) => {
      const swing = Math.sin(t * p.flutter + p.phase);
      // Deitada (swing ~ 0) plana devagar; de pé (|swing| ~ 1) cai mais rápido
      p.y -= p.fall * (0.55 + 0.45 * Math.abs(swing)) * boost * dt;
      p.x += (wind + Math.cos(t * p.flutter + p.phase) * p.glide) * dt;
      p.spin += p.spinSpeed * dt;

      if (p.y < BOTTOM) Object.assign(p, spawn(spread, TOP + random(0, 0.6)));
      if (p.x > edge) p.x = -edge;
      if (p.x < -edge) p.x = edge;

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(
        p.tilt[0] + swing * 0.9,
        p.spin,
        p.tilt[1] + swing * 0.5,
      );
      dummy.scale.setScalar(p.scale);
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
      <meshPhysicalMaterial
        vertexColors
        roughness={0.55}
        sheen={1}
        sheenColor="#ff6a6a"
        sheenRoughness={0.45}
        emissive="#1a0103"
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
