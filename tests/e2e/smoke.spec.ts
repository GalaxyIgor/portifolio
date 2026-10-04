import { expect, test } from "@playwright/test";

test("home em português mostra o hero e todas as seções", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const id of ["about", "skills", "projects", "experience", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("troca de idioma mantém a página", async ({ page }) => {
  await page.goto("/pt/projects");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/projects$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Projects" }),
  ).toBeVisible();
});

test("abre um estudo de caso a partir da home", async ({ page }) => {
  await page.goto("/pt");
  await page.locator("#projects article a").first().click();
  await expect(page).toHaveURL(/\/pt\/projects\/.+/);
  await expect(
    page.getByRole("link", { name: /Voltar para projetos/ }),
  ).toBeVisible();
});

test("filtro de projetos por tecnologia", async ({ page }) => {
  await page.goto("/en/projects");
  await page.getByRole("button", { name: "Three.js" }).click();
  await expect(page.getByRole("button", { name: "Three.js" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("main article")).toHaveCount(1);
});

test("rota desconhecida mostra o 404 localizado", async ({ page }) => {
  await page.goto("/pt/nao-existe");
  await expect(
    page.getByRole("heading", { name: "Página não encontrada" }),
  ).toBeVisible();
});

test("com movimento reduzido, mostra a imagem estática em vez do parallax", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/pt");
  // Sem WebGL: imagem estática e o nome em HTML, visível
  await expect(page.locator('section img[src*="knight"]')).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
  await context.close();
});
