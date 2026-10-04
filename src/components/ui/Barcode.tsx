import { barcodeWidths } from "@/lib/barcode";

type Props = { value: string; height?: number; className?: string };

export function Barcode({ value, height = 28, className }: Props) {
  const widths = barcodeWidths(value);
  const total = widths.reduce((sum, w) => sum + w, 0);

  // Posição x de cada barra = soma das larguras anteriores
  const bars = widths
    .map((w, i) => ({
      w,
      i,
      x: widths.slice(0, i).reduce((sum, v) => sum + v, 0),
    }))
    .filter(({ i }) => i % 2 === 0);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${total} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ height }}
    >
      {bars.map(({ w, x, i }) => (
        <rect key={i} x={x} width={w} height={height} fill="currentColor" />
      ))}
    </svg>
  );
}
