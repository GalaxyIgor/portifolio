"use client";

import { useEffect, useRef } from "react";

type Tilt = { x: number; y: number; active: boolean };

type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** Graus de inclinação (a partir do neutro) que levam ao deslocamento máximo. */
const RANGE = 20;
/** Quão rápido o "neutro" acompanha a posição em que a pessoa segura o aparelho. */
const RECENTER = 0.015;

function clamp(v: number) {
  return Math.max(-1, Math.min(1, v));
}

/**
 * Inclinação do aparelho normalizada em -1..1 (como o cursor no desktop).
 * O neutro acompanha devagar a posição atual, então funciona com o celular
 * em pé, deitado ou na mão inclinado. `active` só fica true quando chegam
 * leituras reais do sensor.
 *
 * iOS 13+ exige permissão a partir de um gesto: pedimos no primeiro toque
 * dentro de `permissionTarget` (o hero).
 */
export function useDeviceTilt(
  enabled: boolean,
  permissionTarget = "[data-hero]",
) {
  const tilt = useRef<Tilt>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (
      !enabled ||
      typeof window === "undefined" ||
      !("DeviceOrientationEvent" in window)
    ) {
      return;
    }

    const state = tilt.current;
    let neutral: { beta: number; gamma: number } | null = null;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // Em paisagem, os eixos do sensor giram junto com a tela
      const angle = screen.orientation?.angle ?? 0;
      let gamma = e.gamma;
      let beta = e.beta;
      if (angle === 90) [gamma, beta] = [e.beta, -e.gamma];
      else if (angle === 270 || angle === -90)
        [gamma, beta] = [-e.beta, e.gamma];

      if (!neutral) neutral = { beta, gamma };
      neutral.beta += (beta - neutral.beta) * RECENTER;
      neutral.gamma += (gamma - neutral.gamma) * RECENTER;

      state.x = clamp((gamma - neutral.gamma) / RANGE);
      state.y = clamp((beta - neutral.beta) / RANGE);
      state.active = true;
    };

    const listen = () =>
      window.addEventListener("deviceorientation", onOrientation, {
        passive: true,
      });

    const Orientation =
      window.DeviceOrientationEvent as OrientationEventWithPermission;
    const target = document.querySelector(permissionTarget);

    const askPermission = () => {
      Orientation.requestPermission?.()
        .then((state) => state === "granted" && listen())
        .catch(() => {});
    };

    if (typeof Orientation.requestPermission === "function") {
      target?.addEventListener("click", askPermission, { once: true });
    } else {
      listen();
    }

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      target?.removeEventListener("click", askPermission);
      state.active = false;
    };
  }, [enabled, permissionTarget]);

  return tilt;
}
