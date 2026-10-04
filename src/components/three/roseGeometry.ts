import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Pétala: um plano subdividido e deformado. A base fica em y=0 e a face
 * aponta para +z (para fora da flor). `cup` dobra as bordas para dentro,
 * `curl` vira a ponta para fora.
 */
export function petalGeometry(
  width: number,
  height: number,
  cup: number,
  curl: number,
) {
  const geo = new THREE.PlaneGeometry(width, height, 6, 8);
  geo.translate(0, height / 2, 0);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (width / 2);
    const ny = y / height;
    // Base estreita, mais larga perto do meio, topo arredondado
    const widthFactor = 0.4 + 0.6 * Math.sin(Math.PI * (0.1 + 0.75 * ny));
    const z = -cup * nx * nx * (0.3 + ny) + curl * ny * ny * ny;
    pos.setXYZ(i, x * widthFactor, y, z);
  }

  geo.computeVertexNormals();
  return geo;
}

function paint(
  geo: THREE.BufferGeometry,
  bottom: THREE.Color,
  top: THREE.Color,
) {
  const pos = geo.attributes.position;
  geo.computeBoundingBox();
  const { min, max } = geo.boundingBox!;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - min.y) / Math.max(max.y - min.y, 1e-6);
    c.copy(bottom).lerp(top, t);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

type RoseColors = { rose: string; roseDeep: string; leaf: string };

/**
 * Rosa inteira em uma geometria: pétalas em espiral (ângulo áureo), mais
 * fechadas no miolo e mais abertas por fora, sépalas e um caule curto.
 * Uma geometria = um draw call por rosa.
 */
export function buildRoseGeometry(
  { rose, roseDeep, leaf }: RoseColors,
  petals = 26,
) {
  const deep = new THREE.Color(roseDeep);
  const red = new THREE.Color(rose);
  const green = new THREE.Color(leaf);
  const greenLight = green.clone().multiplyScalar(1.8);
  const parts: THREE.BufferGeometry[] = [];

  for (let i = 0; i < petals; i++) {
    const t = i / (petals - 1); // 0 = miolo, 1 = pétala externa
    const size = 0.22 + t * 0.42;
    const geo = petalGeometry(
      size * 0.95,
      size,
      0.14 + 0.08 * (1 - t),
      0.04 + t * 0.2,
    );
    // Miolo um pouco mais escuro; pétalas externas pegam mais luz
    paint(geo, deep, red.clone().multiplyScalar(0.75 + t * 0.35));
    geo.rotateX(0.06 + t * t * 1.05); // abre para fora
    geo.translate(0, 0, 0.015 + t * 0.11);
    geo.rotateY(i * GOLDEN_ANGLE);
    parts.push(geo);
  }

  // Sépalas: folhinhas verdes apontando para baixo
  for (let i = 0; i < 5; i++) {
    const geo = petalGeometry(0.14, 0.42, 0.05, 0.12);
    paint(geo, green, greenLight);
    geo.rotateX(1.9);
    geo.translate(0, 0.02, 0.06);
    geo.rotateY((i / 5) * Math.PI * 2 + 0.3);
    parts.push(geo);
  }

  // Caule
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.02, 0),
    new THREE.Vector3(0.04, -0.35, 0.02),
    new THREE.Vector3(-0.03, -0.75, 0),
  ]);
  const stem = new THREE.TubeGeometry(stemCurve, 12, 0.035, 6, false);
  paint(stem, green, green);
  parts.push(stem);

  const merged = mergeGeometries(parts, false);
  for (const part of parts) part.dispose();
  return merged!;
}
