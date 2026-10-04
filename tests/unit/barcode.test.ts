import { describe, expect, it } from "vitest";
import { barcodeWidths } from "@/lib/barcode";

describe("barcodeWidths", () => {
  it("é determinístico", () => {
    expect(barcodeWidths("Igor2026")).toEqual(barcodeWidths("Igor2026"));
  });

  it("muda quando o texto muda", () => {
    expect(barcodeWidths("Igor")).not.toEqual(barcodeWidths("Igar"));
  });

  it("tem guardas nas pontas e 4 barras por caractere", () => {
    const widths = barcodeWidths("ab");
    expect(widths.slice(0, 3)).toEqual([1, 1, 1]);
    expect(widths.slice(-3)).toEqual([1, 1, 1]);
    expect(widths).toHaveLength(3 + 2 * 4 + 3);
  });

  it("usa larguras entre 1 e 3", () => {
    for (const w of barcodeWidths("Portfólio ✦")) {
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(3);
    }
  });
});
