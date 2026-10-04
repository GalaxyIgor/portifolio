import { expect, test } from "@playwright/test";

const origin = "https://portifolio-delta-one-12.vercel.app";

for (const locale of ["pt", "en"]) {
  test(`prévia de compartilhamento em ${locale} usa o domínio público e uma imagem válida`, async ({
    request,
  }) => {
    for (const path of [
      `/${locale}`,
      `/${locale}/projects`,
      `/${locale}/projects/beststop`,
    ]) {
      const response = await request.get(path, {
        headers: { "User-Agent": "Twitterbot" },
      });
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain(`property="og:url" content="${origin}${path}"`);
      expect(html).toContain(
        'name="twitter:card" content="summary_large_image"',
      );
      expect(html).toContain(`rel="canonical" href="${origin}${path}"`);
      expect(html).toContain(
        `name="twitter:image" content="${origin}/${locale}/opengraph-image"`,
      );
      const imageUrl = html.match(/property="og:image" content="([^"]+)"/)?.[1];
      expect(imageUrl).toBeTruthy();
      const image = new URL(imageUrl!);
      // As imagens da convenção de arquivos usam localhost no next dev.
      expect([
        origin,
        new URL(test.info().project.use.baseURL!).origin,
      ]).toContain(image.origin);
      expect(image.pathname).toBe(`/${locale}/opengraph-image`);
      if (path === `/${locale}`) {
        const preview = await request.get(image.pathname + image.search);
        expect(preview.ok()).toBe(true);
        expect(preview.headers()["content-type"]).toContain("image/png");
        const png = await preview.body();
        expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
        expect(png.readUInt32BE(16)).toBe(1200);
        expect(png.readUInt32BE(20)).toBe(630);
      }
      if (path.endsWith("/beststop")) {
        expect(html).toContain('property="og:title" content="BestStop"');
      }
    }
  });
}
