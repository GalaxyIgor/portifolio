"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Elmo de cavaleiro (great helm) procedural.
 * O corpo é um torno (LatheGeometry) de um perfil 2D; fendas, respiros e
 * reforços são peças finas posicionadas sobre a superfície curva.
 * Frente do elmo = +z (theta 0 na CylinderGeometry).
 */

// Perfil [raio, altura] de baixo para cima
const PROFILE: [number, number][] = [
  [1.02, -1.3],
  [1.05, -0.9],
  [1.06, -0.2],
  [1.04, 0.3],
  [1.0, 0.7],
  [0.92, 1.0],
  [0.76, 1.22],
  [0.52, 1.36],
  [0.26, 1.43],
  [0.001, 1.45],
];

/** Raio do perfil numa altura y (interpolação linear). */
function radiusAt(y: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [r0, y0] = PROFILE[i];
    const [r1, y1] = PROFILE[i + 1];
    if (y >= y0 && y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0);
  }
  return PROFILE[0][0];
}

type Props = { compact: boolean };

export function KnightHelm({ compact }: Props) {
  const segments = compact ? 48 : 96;

  const shell = useMemo(
    () =>
      new THREE.LatheGeometry(
        PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
        segments,
      ),
    [segments],
  );

  // Furos de respiro: duas grades na parte baixa, uma de cada lado do reforço central
  const holes = useMemo(() => {
    const list: { position: [number, number, number]; rotation: number }[] = [];
    for (const side of [-1, 1]) {
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          const theta = side * (0.22 + col * 0.13);
          const y = -0.25 - row * 0.17;
          const r = radiusAt(y) + 0.004;
          list.push({
            position: [Math.sin(theta) * r, y, Math.cos(theta) * r],
            rotation: theta,
          });
        }
      }
    }
    return list;
  }, []);

  const slitY = 0.42;
  const slitR = radiusAt(slitY) + 0.006;
  const bandY = 0.62;
  const bandR = radiusAt(bandY) + 0.02;

  return (
    <group>
      {/* Casco cromado */}
      <mesh geometry={shell}>
        <meshStandardMaterial
          color="#cfd2d6"
          metalness={1}
          roughness={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fendas dos olhos */}
      {[-1, 1].map((side) => (
        <mesh key={side} position-y={slitY}>
          <cylinderGeometry
            args={[
              slitR,
              slitR,
              0.085,
              24,
              1,
              true,
              side < 0 ? -0.78 : 0.1,
              0.68,
            ]}
          />
          <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Banda da testa, em latão */}
      <mesh position-y={bandY}>
        <cylinderGeometry
          args={[bandR, bandR + 0.012, 0.13, segments, 1, true]}
        />
        <meshStandardMaterial
          color="#b08a3e"
          metalness={1}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Reforço vertical: forma a cruz com a banda */}
      <mesh position-y={-0.48}>
        <cylinderGeometry
          args={[1.075, 1.065, 1.62, 12, 1, true, -0.07, 0.14]}
        />
        <meshStandardMaterial
          color="#b08a3e"
          metalness={1}
          roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rebites ao longo da banda */}
      {Array.from({ length: 14 }, (_, i) => {
        const theta = (i / 14) * Math.PI * 2 + 0.22;
        return (
          <mesh
            key={i}
            position={[
              Math.sin(theta) * (bandR + 0.01),
              bandY,
              Math.cos(theta) * (bandR + 0.01),
            ]}
          >
            <sphereGeometry args={[0.028, 8, 6]} />
            <meshStandardMaterial
              color="#e3c27a"
              metalness={1}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* Respiros */}
      {holes.map((hole, i) => (
        <mesh key={i} position={hole.position} rotation-y={hole.rotation}>
          <circleGeometry args={[0.028, 10]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
      ))}

      {/* Aro inferior */}
      <mesh position-y={-1.3} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.025, 0.04, 10, segments]} />
        <meshStandardMaterial color="#b08a3e" metalness={1} roughness={0.35} />
      </mesh>
    </group>
  );
}
