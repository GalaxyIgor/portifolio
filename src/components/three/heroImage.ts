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
  /** Ponto que fica visível em telas estreitas (uv da imagem, y para cima). */
  focus: [0.36, 0.5] as [number, number],
  /**
   * Profundidade do nome (0 = horizonte, 1 = colado na câmera).
   * Nesta imagem: céu 0, ruínas ~0.12, cavaleiro ~0.32–0.37, flores da frente ~0.9.
   * 0.2 põe o nome na frente das ruínas e atrás do cavaleiro.
   */
  textDepth: 0.2,
};

/**
 * Tamanho e posição do nome. Usado pelo canvas e espelhado no CSS do <h1>
 * (font-size: clamp(6rem, 30vw, 24rem); top: 34%, ou 20% em retrato)
 * para a troca entre os dois não pular. Em retrato o cavaleiro ocupa o
 * centro da tela, então o nome sobe para o céu acima do elmo.
 */
export function NAME_LAYOUT(width: number, height: number) {
  const portrait = height > width;
  return {
    fontSize: Math.min(Math.max(width * 0.3, 96), 384),
    centerY: height * (portrait ? 0.2 : 0.34),
  };
}
