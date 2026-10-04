import { expect, test } from "@playwright/test";

test("hover conecta skill, projeto e experiência e mantém o painel visível", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt");
  const skill = page.locator("#skill-typescript button");
  const panel = page.getByRole("region", { name: "Conexões" });
  await skill.hover();
  await expect(panel.getByRole("link", { name: "MuscleAi ↗" })).toBeVisible();
  await expect(panel.getByRole("link", { name: "SplitCut ↗" })).toBeVisible();
  await expect(panel.getByText(/JavaScript com tipos/)).toBeVisible();
  await panel.getByRole("link", { name: "Upvox ↘" }).click();
  await expect(page).toHaveURL(/#experience-upvox$/);
  await page
    .locator("#experience-upvox")
    .getByRole("link", { name: "TypeScript" })
    .click();
  await expect(page).toHaveURL(/#skill-typescript$/);
  await panel.getByRole("link", { name: "MuscleAi ↗" }).click();
  await expect(page).toHaveURL(/\/pt\/projects\/muscleai$/);
  await page.locator("main").getByRole("link", { name: "TypeScript" }).click();
  await expect(page).toHaveURL(/\/pt#skill-typescript$/);
  await expect(
    panel.getByRole("heading", { name: "TypeScript" }),
  ).toBeVisible();
  await page.locator("#skill-vitest button").hover();
  await expect(panel.getByText(/Ainda não há projetos/)).toBeVisible();
});

test("teclado e toque mostram explicações em inglês sem overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  try {
    const page = await context.newPage();
    await page.goto("/en");
    const panel = page.getByRole("region", { name: "Connections" });
    await page.locator("#skill-typescript button").focus();
    await expect(panel.getByText(/JavaScript with types/)).toBeVisible();
    await page.locator("#skill-css-moderno button").tap();
    await expect(panel.getByText(/Style language that defines/)).toBeVisible();
    await page.locator("#skill-typescript button").tap();
    await expect(panel.getByRole("link", { name: "SplitCut ↗" })).toBeVisible();
    await expect(
      panel.locator(".font-display").first().locator(".."),
    ).toHaveCSS("transform", "none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await panel.getByRole("link", { name: "Upvox ↘" }).tap();
    await expect(page).toHaveURL(/\/en#experience-upvox$/);
  } finally {
    await context.close();
  }
});

for (const locale of ["pt", "en"]) {
  test(`CV em ${locale} está disponível para download`, async ({
    page,
    request,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    const link = page.locator(`a[download][href="/cv/igor-cv-${locale}.pdf"]`);
    await expect(link).toBeVisible();
    const downloadEvent = page.waitForEvent("download");
    await link.click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe(`igor-cv-${locale}.pdf`);
    const pdf = await request.get(`/cv/igor-cv-${locale}.pdf`);
    expect(pdf.ok()).toBe(true);
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
}

test("painel anima a saída e entrada das conexões preservando a moldura", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/pt");
  const panel = page.getByRole("region", { name: "Conexões" });
  await page.locator("#skill-typescript button").hover();
  const content = panel
    .getByRole("heading", { name: "TypeScript" })
    .locator("..");
  await expect(content).toHaveCSS("opacity", "1");
  const oldContent = (await content.elementHandle())!;
  const frame = (await panel.locator(".border").first().elementHandle())!;
  await page.locator("#skill-javascript button").hover();
  await expect
    .poll(() =>
      oldContent.evaluate((element) =>
        Number(getComputedStyle(element).opacity),
      ),
    )
    .toBeLessThan(1);
  await expect(
    panel.getByRole("heading", { name: "JavaScript" }).locator(".."),
  ).toHaveCSS("opacity", "1");
  expect(await oldContent.evaluate((element) => element.isConnected)).toBe(
    false,
  );
  expect(await frame.evaluate((element) => element.isConnected)).toBe(true);
  await page
    .locator("#skills")
    .screenshot({ path: testInfo.outputPath("skill-connections-desktop.png") });
});
