import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";
import { useDeviceTilt } from "@/components/three/useDeviceTilt";

// jsdom não tem DeviceOrientationEvent: um substituto mínimo
class FakeOrientationEvent extends Event {
  beta: number | null;
  gamma: number | null;
  constructor(
    type: string,
    init: { beta: number | null; gamma: number | null },
  ) {
    super(type);
    this.beta = init.beta;
    this.gamma = init.gamma;
  }
}

function tiltTo(beta: number, gamma: number, times = 1) {
  act(() => {
    for (let i = 0; i < times; i++) {
      window.dispatchEvent(
        new FakeOrientationEvent("deviceorientation", { beta, gamma }),
      );
    }
  });
}

function setScreenAngle(angle: number) {
  Object.defineProperty(screen, "orientation", {
    value: { angle },
    configurable: true,
  });
}

beforeEach(() => {
  vi.stubGlobal("DeviceOrientationEvent", FakeOrientationEvent);
  setScreenAngle(0);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("useDeviceTilt", () => {
  it("fica inativo até chegar uma leitura do sensor", () => {
    const { result } = renderHook(() => useDeviceTilt(true));
    expect(result.current.current.active).toBe(false);
    tiltTo(null as unknown as number, null as unknown as number);
    expect(result.current.current.active).toBe(false);
  });

  it("normaliza a inclinação a partir da posição em que o aparelho é segurado", () => {
    const { result } = renderHook(() => useDeviceTilt(true));
    tiltTo(45, 0); // segurando inclinado: vira o neutro
    expect(result.current.current).toMatchObject({ x: 0, y: 0, active: true });

    tiltTo(45, 10); // 10° para a direita
    expect(result.current.current.x).toBeGreaterThan(0.4);
    expect(result.current.current.x).toBeLessThanOrEqual(0.5);

    tiltTo(45, 90); // muito além do limite
    expect(result.current.current.x).toBe(1);
  });

  it("o neutro acompanha devagar a nova posição", () => {
    const { result } = renderHook(() => useDeviceTilt(true));
    tiltTo(45, 0);
    tiltTo(45, 10, 400); // ficou parado inclinado por um tempo
    expect(Math.abs(result.current.current.x)).toBeLessThan(0.05);
  });

  it("em paisagem usa o eixo do sensor girado", () => {
    setScreenAngle(90);
    const { result } = renderHook(() => useDeviceTilt(true));
    tiltTo(0, 0);
    tiltTo(10, 0); // em paisagem, beta vira o eixo horizontal
    expect(result.current.current.x).toBeGreaterThan(0.4);
    expect(Math.abs(result.current.current.y)).toBe(0);
  });

  it("desligado, não escuta o sensor", () => {
    const { result } = renderHook(() => useDeviceTilt(false));
    tiltTo(45, 10);
    expect(result.current.current.active).toBe(false);
  });

  it("no iOS só escuta depois da permissão, pedida no toque no hero", async () => {
    const requestPermission = vi.fn().mockResolvedValue("granted");
    vi.stubGlobal(
      "DeviceOrientationEvent",
      Object.assign(FakeOrientationEvent, { requestPermission }),
    );
    const hero = document.createElement("section");
    hero.setAttribute("data-hero", "");
    document.body.append(hero);

    const { result } = renderHook(() => useDeviceTilt(true));
    tiltTo(45, 10);
    expect(result.current.current.active).toBe(false);

    await act(async () => {
      hero.click();
      await Promise.resolve();
    });
    expect(requestPermission).toHaveBeenCalledOnce();

    tiltTo(45, 10);
    expect(result.current.current.active).toBe(true);
    delete (FakeOrientationEvent as { requestPermission?: unknown })
      .requestPermission;
  });
});
