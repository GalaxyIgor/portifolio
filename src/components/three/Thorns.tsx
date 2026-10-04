"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Ramo de espinhos em espiral subindo pela base do elmo. */
export function Thorns({ color }: { color: string }) {
  const geometry = useMemo(() => {
    const turns = 1.1;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const angle = t * turns * Math.PI * 2 + 0.6;
      const r = 1.13 - t * 0.05 + Math.sin(t * 19) * 0.025;
      points.push(
        new THREE.Vector3(
          Math.sin(angle) * r,
          -1.45 + t * 0.75,
          Math.cos(angle) * r,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const parts: THREE.BufferGeometry[] = [
      new THREE.TubeGeometry(curve, 160, 0.03, 6, false),
    ];

    // Espinhos: cones apontando para fora do ramo, alternando de lado
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 1; i < 26; i++) {
      const t = i / 26;
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const outward = new THREE.Vector3(p.x, 0, p.z).normalize();
      const side = new THREE.Vector3()
        .crossVectors(tangent, outward)
        .normalize();
      const dir = outward
        .clone()
        .multiplyScalar(0.6)
        .add(side.multiplyScalar(i % 2 ? 0.8 : -0.8))
        .normalize();
      const cone = new THREE.ConeGeometry(0.018, 0.11, 5);
      cone.translate(0, 0.055, 0);
      cone.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir));
      cone.translate(p.x, p.y, p.z);
      parts.push(cone);
    }

    const merged = mergeGeometries(parts, false);
    for (const part of parts) part.dispose();
    return merged!;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
