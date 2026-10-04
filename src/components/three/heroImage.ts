/**
 * Imagem do hero e seus parâmetros. Para trocar a imagem:
 *   1. salve a nova em public/hero/
 *   2. rode `node scripts/depth-map.mjs <imagem> <saída-depth.png>`
 *   3. ajuste width/height, focus e textDepth abaixo
 */
export const HERO_IMAGE = {
  src: "/hero/knight.webp",
  depth: "/hero/knight-depth.webp",
  width: 1672,
  height: 941,
  /**
   * Centro do recorte (uv da imagem, y para cima). Em retrato, foca o
   * cavaleiro; deitado, centraliza a cena e o cavaleiro fica à esquerda,
   * deixando o meio livre para o nome. Espelhado na <Image> (classes portrait:).
   */
  focus: {
    portrait: [0.36, 0.5] as [number, number],
    landscape: [0.5, 0.5] as [number, number],
  },
  /**
   * Profundidade do nome (0 = horizonte, 1 = colado na câmera).
   * Nesta imagem: céu 0, ruínas ~0.12, cavaleiro ~0.32–0.37, flores da frente ~0.9.
   * 0.2 põe o nome na frente das ruínas e atrás do cavaleiro.
   */
  textDepth: 0.2,
};

/**
 * Tamanho e posição do nome. Usado pelo canvas e espelhado no CSS do <h1>
 * (font-size: clamp(6rem, 30vw, 24rem); top: 34%, ou max(20%, 5rem + 12.6vw) em retrato)
 * para a troca entre os dois não pular. Em retrato o cavaleiro ocupa o
 * centro da tela, então o nome sobe para o céu acima do elmo.
 */
/** Altura da navbar (h-20), que fica sobre o topo do hero. */
const NAVBAR_HEIGHT = 80;

export function NAME_LAYOUT(width: number, height: number) {
  const portrait = height > width;
  const fontSize = Math.min(Math.max(width * 0.3, 96), 384);
  return {
    fontSize,
    // Em retrato, nunca acima da navbar (80px): metade da altura útil das letras ≈ 0.42em
    centerY: portrait
      ? Math.max(height * 0.2, NAVBAR_HEIGHT + fontSize * 0.42)
      : height * 0.34,
  };
}
