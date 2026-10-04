export type ScenePalette = {
  dark: boolean;
  accent: string;
  rose: string;
  roseDeep: string;
  leaf: string;
};

/** Lê as cores da cena dos tokens CSS. Chamar de novo quando `theme` mudar. */
export function readPalette(theme: string): ScenePalette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => css.getPropertyValue(name).trim();
  return {
    dark: theme === "dark",
    accent: get("--accent"),
    rose: get("--rose"),
    roseDeep: get("--rose-deep"),
    leaf: get("--leaf"),
  };
}
