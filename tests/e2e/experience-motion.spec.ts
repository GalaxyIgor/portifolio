import { expect, test } from "@playwright/test";

test("linha do tempo revela cada etapa e mantém a leitura ao voltar", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/pt");
  const steps = page.locator(".experience-step");
  await expect(steps).toHaveCount(4);
  for (const step of await steps.all()) {
    await step.scrollIntoViewIfNeeded();
    await expect(step).toHaveAttribute("data-visible", "true");
    await expect(step.locator(".experience-content")).toHaveCSS("opacity", "1");
    await expect(step.locator(".experience-marker")).toHaveCSS(
      "transform",
      "none",
    );
  }
  const first = steps.first();
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator(".experience-content")).toHaveCSS("opacity", "1");
  await first.hover();
  await expect(first.locator(".experience-entry")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 4, 0)",
  );
  await first.screenshot({
    path: testInfo.outputPath("experience-active.png"),
  });
  await page.mouse.move(1, 1);
  await expect(first.locator(".experience-entry")).toHaveCSS(
    "transform",
    "none",
  );
  const link = first.getByRole("link", { name: "TypeScript" });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#skill-typescript$/);
});

test("experiência e certificados ficam legíveis no celular com movimento reduzido", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/en#experience");
    const steps = page.locator(".experience-step");
    for (const step of await steps.all()) {
      await expect(step.locator(".experience-content")).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(step.locator(".experience-content")).toHaveCSS(
        "transform",
        "none",
      );
    }
    await steps.first().hover();
    await expect(steps.first().locator(".experience-entry")).toHaveCSS(
      "transform",
      "none",
    );
    const certificates = page.locator(".certification-row");
    await expect(certificates).toHaveCount(11);
    await certificates.last().scrollIntoViewIfNeeded();
    await expect(certificates.last()).toHaveCSS("opacity", "1");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});
