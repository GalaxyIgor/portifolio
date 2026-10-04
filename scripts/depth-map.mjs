/**
 * Gera o mapa de profundidade da imagem do hero com Depth Anything V2 (Small).
 * Roda localmente, uma vez por imagem. O modelo fica em cache após o primeiro download.
 *
 *   node scripts/depth-map.mjs [entrada] [saída]
 *   node scripts/depth-map.mjs public/hero/knight.webp public/hero/knight-depth.webp
 *
 * Claro = perto da câmera, escuro = longe. A saída tem dois canais:
 *   R: profundidade levemente dilatada — decide o que encobre o nome.
 *      A dilatação cobre a diferença entre a borda do mapa e a borda da pintura.
 *   G: profundidade bem dilatada e suavizada — usada só no deslocamento do parallax,
 *      para o fundo não ser "arrastado" junto com as bordas do primeiro plano.
 */
import { pipeline, RawImage } from "@huggingface/transformers";

const input = process.argv[2] ?? "public/hero/knight.webp";
const output = process.argv[3] ?? "public/hero/knight-depth.webp";

/** Filtro de máximo separável (dilatação em tons de cinza). */
function dilate(src, width, height, radius) {
  const tmp = new Uint8Array(src.length);
  const out = new Uint8Array(src.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let max = 0;
      for (
        let k = Math.max(0, x - radius);
        k <= Math.min(width - 1, x + radius);
        k++
      ) {
        max = Math.max(max, src[y * width + k]);
      }
      tmp[y * width + x] = max;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let max = 0;
      for (
        let k = Math.max(0, y - radius);
        k <= Math.min(height - 1, y + radius);
        k++
      ) {
        max = Math.max(max, tmp[k * width + x]);
      }
      out[y * width + x] = max;
    }
  }
  return out;
}

/** Desfoque de caixa separável (em float); três passadas aproximam um gaussiano. */
function boxBlur(src, width, height, radius, passes = 3) {
  let a = Float32Array.from(src);
  let b = new Float32Array(src.length);
  const size = radius * 2 + 1;
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          sum += a[y * width + Math.min(width - 1, Math.max(0, x + k))];
        }
        b[y * width + x] = sum / size;
      }
    }
    [a, b] = [b, a];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          sum += a[Math.min(height - 1, Math.max(0, y + k)) * width + x];
        }
        b[y * width + x] = sum / size;
      }
    }
    [a, b] = [b, a];
  }
  return a;
}

function blur(src, width, height, radius, passes = 3) {
  return Uint8Array.from(boxBlur(src, width, height, radius, passes), (v) =>
    Math.round(v),
  );
}

/**
 * Guided filter (He et al.): suaviza `input` seguindo as bordas de `guide`.
 * Aqui encaixa a borda da profundidade (calculada em baixa resolução) nas
 * bordas reais da pintura, eliminando os degraus da ampliação.
 * Valores em 0–1.
 */
function guidedFilter(guide, input, width, height, radius, eps) {
  const mean = (arr) => boxBlur(arr, width, height, radius, 1);
  const n = guide.length;
  const meanI = mean(guide);
  const meanP = mean(input);
  const ii = new Float32Array(n);
  const ip = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    ii[i] = guide[i] * guide[i];
    ip[i] = guide[i] * input[i];
  }
  const corrI = mean(ii);
  const corrIp = mean(ip);
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const varI = corrI[i] - meanI[i] * meanI[i];
    const covIp = corrIp[i] - meanI[i] * meanP[i];
    a[i] = covIp / (varI + eps);
    b[i] = meanP[i] - a[i] * meanI[i];
  }
  const meanA = mean(a);
  const meanB = mean(b);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = meanA[i] * guide[i] + meanB[i];
  return out;
}

const estimator = await pipeline(
  "depth-estimation",
  "onnx-community/depth-anything-v2-small",
  {
    dtype: "q8",
  },
);

const image = await RawImage.read(input);
const { depth: raw } = await estimator(image);
const depth = (
  raw.width === image.width ? raw : await raw.resize(image.width, image.height)
).grayscale();
const { width, height } = depth;

// Raios proporcionais à imagem (valores calibrados numa imagem de ~1700px)
const unit = Math.max(1, Math.round(width / 1700));

// Guia: luminância da pintura, no mesmo tamanho do mapa
const color = (await image.rgb().resize(width, height)).data;
const guide = new Float32Array(width * height);
for (let i = 0; i < guide.length; i++) {
  guide[i] =
    (0.299 * color[i * 3] +
      0.587 * color[i * 3 + 1] +
      0.114 * color[i * 3 + 2]) /
    255;
}
const dilated = dilate(depth.data, width, height, 2 * unit);
const refined = guidedFilter(
  guide,
  Float32Array.from(dilated, (v) => v / 255),
  width,
  height,
  6 * unit,
  1e-3,
);
const occlusion = Uint8Array.from(refined, (v) =>
  Math.round(Math.min(1, Math.max(0, v)) * 255),
);
const displacement = blur(
  dilate(depth.data, width, height, 10 * unit),
  width,
  height,
  6 * unit,
);

const rgb = new Uint8ClampedArray(width * height * 3);
for (let i = 0; i < width * height; i++) {
  rgb[i * 3] = occlusion[i];
  rgb[i * 3 + 1] = displacement[i];
  rgb[i * 3 + 2] = displacement[i]; // canal não usado; repetir G comprime melhor
}
await new RawImage(rgb, width, height, 3).save(output); // a extensão define o formato

console.log(`Mapa de profundidade salvo em ${output} (${width}×${height})`);
