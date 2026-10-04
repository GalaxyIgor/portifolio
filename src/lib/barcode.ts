/**
 * Gera larguras de barras a partir de um texto, de forma determinística.
 * Índices pares são barras, ímpares são espaços. Larguras de 1 a 3.
 * Não é um código legível por leitor: é ornamento que muda com o texto.
 */
export function barcodeWidths(text: string): number[] {
  const guard = [1, 1, 1];
  const body: number[] = [];
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    body.push(
      (code % 3) + 1,
      ((code >> 2) % 2) + 1,
      ((code >> 3) % 3) + 1,
      ((code >> 5) % 2) + 1,
    );
  }
  return [...guard, ...body, ...guard];
}
