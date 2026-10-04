import { expect, test } from "@playwright/test";

test("estrelas acompanham a seção visível e navegam por âncoras", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt");
  const stars = page.getByRole("navigation", { name: "Navegação por seções" });
  await expect(stars.getByRole("link")).toHaveCount(6);
  await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#home",
  );

  for (const id of ["about", "skills", "projects", "experience", "contact"]) {
    await page
      .locator(`#${id}`)
      .evaluate((section) => section.scrollIntoView());
    await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
  }

  await stars
    .getByRole("link", { name: "Ir para Início", exact: true })
    .click();
  await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#home",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(stars).toBeVisible();
  await stars
    .getByRole("link", { name: "Ir para Contato", exact: true })
    .click();
  await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#contact",
  );

  await page.goto("/en");
  await expect(
    page
      .getByRole("navigation", { name: "Section navigation" })
      .getByRole("link", { name: "Go to Home" }),
  ).toBeVisible();
  await page.goto("/en/projects");
  await expect(
    page.getByRole("navigation", { name: "Section navigation" }),
  ).toHaveCount(0);
});

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
