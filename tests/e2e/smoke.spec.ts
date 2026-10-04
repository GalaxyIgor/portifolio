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

test("com movimento reduzido, mostra a ilustração estática em vez do 3D", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/pt");
  // O fallback é o SVG do elmo (viewBox próprio), não os ornamentos
  await expect(page.locator('svg[viewBox="0 0 400 460"]')).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await context.close();
});
