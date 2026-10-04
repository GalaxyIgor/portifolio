type Capabilities = {
  reducedMotion: boolean;
  webgl: boolean;
  cores?: number;
  saveData?: boolean;
};

/** Decide se vale a pena carregar o Three.js neste aparelho. */
export function shouldRender3D({
  reducedMotion,
  webgl,
  cores,
  saveData,
}: Capabilities) {
  if (reducedMotion || !webgl || saveData) return false;
  if (cores !== undefined && cores < 4) return false;
  return true;
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectCapabilities(): Capabilities {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    webgl: hasWebGL(),
    cores: nav.hardwareConcurrency,
    saveData: nav.connection?.saveData,
  };
}
