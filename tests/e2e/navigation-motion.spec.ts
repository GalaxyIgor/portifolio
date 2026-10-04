import { expect, test } from "@playwright/test";

test("estudos de caso reaparecem ao navegar e respeitam movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/pt/projects/beststop");
  const chapter = page.locator(".project-chapter-entry");
  await expect(chapter).toHaveCSS("animation-name", "chapter-fade");
  await expect(chapter).toHaveCSS("animation-duration", "0.2s");
  const previousChapter = (await chapter.elementHandle())!;
  await page.locator("main article nav a").click();
  await expect(page).toHaveURL(/\/pt\/projects\/muscleai$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MuscleAi");
  expect(await previousChapter.evaluate((element) => element.isConnected)).toBe(
    false,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(chapter).toHaveCSS("animation-name", "none");
  await expect(chapter).toHaveCSS("opacity", "1");
});

test("menu mobile abre e fecha e redes sociais mantêm nome e ícone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/pt");
  const panel = page.locator(".mobile-menu-panel");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(panel).toBeVisible();
  await expect(panel).toHaveCSS("animation-name", "menu-unfold");
  await expect(panel.getByRole("link")).toHaveCount(5);
  await page.keyboard.press("Escape");
  await expect(panel).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(panel).toHaveCSS("animation-name", "none");
  await expect(panel.locator("li").first()).toHaveCSS("animation-name", "none");
  await panel.getByRole("link", { name: /Contato/ }).click();
  await expect(panel).not.toBeVisible();
  for (const name of ["GitHub", "LinkedIn"]) {
    const social = page
      .locator("#contact")
      .getByRole("link", { name: `${name} ↗` });
    await expect(social).toBeVisible();
    await expect(social.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    await social.focus();
    await expect(social).toBeFocused();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
