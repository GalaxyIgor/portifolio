import { describe, expect, it } from "vitest";
import { shouldRender3D } from "@/components/three/support";

const capable = {
  reducedMotion: false,
  webgl: true,
  cores: 8,
  saveData: false,
};

describe("shouldRender3D", () => {
  it("liga o 3D em aparelho capaz", () => {
    expect(shouldRender3D(capable)).toBe(true);
  });

  it("respeita prefers-reduced-motion", () => {
    expect(shouldRender3D({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("desliga sem WebGL", () => {
    expect(shouldRender3D({ ...capable, webgl: false })).toBe(false);
  });

  it("desliga com economia de dados", () => {
    expect(shouldRender3D({ ...capable, saveData: true })).toBe(false);
  });

  it("desliga em processadores com poucos núcleos", () => {
    expect(shouldRender3D({ ...capable, cores: 2 })).toBe(false);
  });

  it("liga quando o navegador não informa os núcleos", () => {
    expect(shouldRender3D({ ...capable, cores: undefined })).toBe(true);
  });
});
