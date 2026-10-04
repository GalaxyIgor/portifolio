"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Petals } from "./Petals";
import { HERO_IMAGE, NAME_LAYOUT } from "./heroImage";

type Props = {
  name: string;
  /** false pausa o loop de render (ex.: hero fora da tela). */
  active: boolean;
  compact: boolean;
  /** Chamado quando as texturas carregaram e o primeiro frame foi desenhado. */
  onReady: () => void;
};

/**
 * Parallax 2.5D: uma imagem + seu mapa de profundidade.
 * O shader desloca cada pixel conforme a profundidade (perto mexe mais)
 * e desenha o nome numa profundidade fixa — o que estiver mais perto que
 * ele (o cavaleiro, as flores) o encobre, o que estiver mais longe (céu,
 * ruínas) fica atrás.
 */
export default function ParallaxScene({
  name,
  active,
  compact,
  onReady,
}: Props) {
  return (
    <Canvas
      aria-hidden
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{
        antialias: !compact, // suaviza a borda das pétalas; no mobile, desempenho primeiro
        alpha: false,
        powerPreference: "high-performance",
      }}
      className="pointer-events-none !absolute inset-0"
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[2, 3, 4]} intensity={1} color="#ffc9a3" />
      {/* Contraluz do pôr do sol: acende as bordas das pétalas */}
      <directionalLight
        position={[1.5, 0.5, -4]}
        intensity={2.4}
        color="#ff7a3d"
      />
      <DepthPlane name={name} compact={compact} onReady={onReady} />
      <PetalLayer compact={compact} />
    </Canvas>
  );
}

const PLANE_Z = -2;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform sampler2D uText;
  uniform vec4 uFit;       // xy: fração visível da imagem (cover), zw: centro do recorte
  uniform vec4 uState;     // xy: cursor -1..1 suavizado, z: scroll 0..1, w: entrada do nome 0..1
  uniform float uStrength;
  uniform float uPivot;     // profundidade que fica parada
  uniform float uTextDepth;
  uniform vec3 uTextColor;
  uniform vec3 uFade;
  varying vec2 vUv;

  void main() {
    vec2 uScale = uFit.xy;
    vec2 uFocus = uFit.zw;
    vec2 uPointer = uState.xy;
    float uScroll = uState.z;
    float uIntro = uState.w;
    float zoom = 1.0 + uScroll * 0.06;
    vec2 base = (vUv - 0.5) * uScale / zoom + uFocus;
    vec2 dir = uPointer * uStrength + vec2(0.0, uScroll * 0.05);

    // Aproxima o deslocamento inverso com algumas iterações
    vec2 uv = base;
    float depth = 0.0;
    // G: profundidade suavizada, só para o deslocamento (evita repuxar as bordas)
    for (int i = 0; i < 5; i++) {
      depth = texture2D(uDepth, uv).g;
      uv = base + dir * (depth - uPivot);
    }
    // R: profundidade com borda firme, para decidir o que encobre o nome
    depth = texture2D(uDepth, uv).r;
    vec3 color = texture2D(uImage, clamp(uv, 0.001, 0.999)).rgb;

    // Nome: vive na própria profundidade, então se move junto com essa camada
    vec2 textUv = vUv + dir * (uTextDepth - uPivot) / uScale * zoom;
    float text = texture2D(uText, textUv).a * uIntro;
    float inFront = smoothstep(uTextDepth - 0.035, uTextDepth + 0.035, depth);
    color = mix(color, uTextColor, text * (1.0 - inFront));

    // Vinheta e transição para o fundo da página
    vec2 v = (vUv - vec2(0.5, 0.55)) * vec2(1.0, 1.25);
    color *= mix(0.5, 1.0, smoothstep(0.95, 0.25, length(v)));
    color = mix(color, uFade, smoothstep(0.28, 0.0, vUv.y));

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Recorte "cover" da imagem para a proporção da tela, com folga para o deslocamento. */
function coverFit(width: number, height: number) {
  const canvasAspect = width / height;
  const imageAspect = HERO_IMAGE.width / HERO_IMAGE.height;
  const margin = 0.94;
  const sx =
    (canvasAspect > imageAspect ? 1 : canvasAspect / imageAspect) * margin;
  const sy =
    (canvasAspect > imageAspect ? imageAspect / canvasAspect : 1) * margin;
  const [fx, fy] =
    canvasAspect < 1 ? HERO_IMAGE.focus.portrait : HERO_IMAGE.focus.landscape;
  return {
    scale: [sx, sy] as const,
    focus: [
      THREE.MathUtils.clamp(fx, sx / 2, 1 - sx / 2),
      THREE.MathUtils.clamp(fy, sy / 2, 1 - sy / 2),
    ] as const,
  };
}

function hexToVec3(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
}

function DepthPlane({ name, compact, onReady }: Omit<Props, "active">) {
  const [image, depth] = useTexture([HERO_IMAGE.src, HERO_IMAGE.depth]);
  const { size, viewport, camera, gl } = useThree();
  const view = viewport.getCurrentViewport(camera, [0, 0, PLANE_Z]);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const ready = useRef(false);
  const smooth = useRef({ x: 0, y: 0, scroll: 0 });

  const textCanvas = useMemo(() => document.createElement("canvas"), []);
  const textTexture = useMemo(
    () => new THREE.CanvasTexture(textCanvas),
    [textCanvas],
  );

  const uniforms = useMemo(
    () => ({
      uImage: { value: image },
      uDepth: { value: depth },
      uText: { value: textTexture },
      uFit: { value: new THREE.Vector4(1, 1, 0.5, 0.5) },
      uState: { value: new THREE.Vector4() },
      uStrength: { value: compact ? 0.02 : 0.03 },
      uPivot: { value: 0.3 },
      uTextDepth: { value: HERO_IMAGE.textDepth },
      uTextColor: { value: hexToVec3("#ece6da") },
      uFade: { value: hexToVec3("#0a0a0a") },
    }),
    [image, depth, textTexture, compact],
  );

  // Desenha o nome numa textura do tamanho da tela, com a fonte do site
  useEffect(() => {
    let cancelled = false;
    const dpr = Math.min(gl.getPixelRatio(), 2);
    const family =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-pirata")
        .trim() || "serif";
    const { fontSize, centerY } = NAME_LAYOUT(size.width, size.height);

    document.fonts.load(`${fontSize}px ${family}`).then(() => {
      if (cancelled) return;
      textCanvas.width = Math.round(size.width * dpr);
      textCanvas.height = Math.round(size.height * dpr);
      const ctx = textCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.scale(dpr, dpr);
      ctx.font = `${fontSize}px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText(name, size.width / 2, centerY);
      // A textura tem tamanho fixo na GPU (texStorage2D): se a tela mudou de
      // tamanho, é preciso liberar e alocar de novo, senão o nome sai esticado.
      textTexture.dispose();
      textTexture.needsUpdate = true;
    });
    return () => {
      cancelled = true;
    };
  }, [name, size, gl, textCanvas, textTexture]);

  useEffect(() => () => textTexture.dispose(), [textTexture]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const ease = 1 - Math.exp(-delta * 3);
    const t = state.clock.elapsedTime;
    // No mobile não há cursor: um balanço lento faz o papel do mouse
    const px = compact ? Math.sin(t * 0.4) * 0.6 : pointer.current.x;
    const py = compact ? Math.cos(t * 0.33) * 0.3 : -pointer.current.y;
    const m = smooth.current;
    m.x += (px - m.x) * ease;
    m.y += (py - m.y) * ease;
    m.scroll += (scroll.current - m.scroll) * ease;

    const u = material.current?.uniforms;
    if (!u) return;
    const fit = coverFit(state.size.width, state.size.height);
    u.uFit.value.set(fit.scale[0], fit.scale[1], fit.focus[0], fit.focus[1]);
    u.uState.value.set(
      m.x,
      m.y,
      m.scroll,
      THREE.MathUtils.smoothstep(t, 0.2, 1.6),
    );

    if (!ready.current) {
      ready.current = true;
      onReady();
    }
  });

  return (
    <mesh position-z={PLANE_Z}>
      <planeGeometry args={[view.width, view.height]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}

function PetalLayer({ compact }: { compact: boolean }) {
  const { viewport, camera } = useThree();
  const width = viewport.getCurrentViewport(camera, [0, 0, 0]).width;
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <Petals count={compact ? 10 : 24} scroll={scroll} spread={width} />;
}
