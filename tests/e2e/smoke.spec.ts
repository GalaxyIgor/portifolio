import { expect, test } from "@playwright/test";

test("estrelas somem quando a página para e reaparecem na rolagem e no foco", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt");
  const stars = page.getByRole("navigation", { name: "Navegação por seções" });
  await page.mouse.move(200, 200);
  await expect(stars).toHaveCSS("opacity", "0");
  await page.mouse.wheel(0, 600);
  await expect(stars).toHaveCSS("opacity", "1");
  await expect(stars).toHaveCSS("opacity", "0");
  await stars.locator("a").first().focus();
  await expect(stars).toHaveCSS("opacity", "1");
  await page.locator("h1").evaluate((element) => {
    element.setAttribute("tabindex", "-1");
    element.focus();
  });
  await expect(stars).toHaveCSS("opacity", "0");
  const width = page.viewportSize()!.width;
  await page.mouse.move(width - 30, 300);
  await expect(stars).toHaveCSS("opacity", "1");
});

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
  const progress = () =>
    stars
      .locator("ul")
      .evaluate((track) =>
        Number(track.style.getPropertyValue("--section-progress")),
      );
  await expect.poll(progress).toBe(0);

  // Meio do caminho entre duas seções: o trilho acompanha a leitura.
  await page.evaluate(() => {
    const about =
      document.getElementById("about")!.getBoundingClientRect().top +
      window.scrollY;
    const skills =
      document.getElementById("skills")!.getBoundingClientRect().top +
      window.scrollY;
    window.scrollTo(0, (about + skills) / 2 - window.innerHeight / 2);
  });
  await expect.poll(progress).toBeCloseTo(0.3, 2);

  for (const id of ["about", "skills", "projects", "experience", "contact"]) {
    await page
      .locator(`#${id}`)
      .evaluate((section) => section.scrollIntoView());
    await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
  }
  await expect.poll(progress).toBe(1);

  await stars
    .getByRole("link", { name: "Ir para Início", exact: true })
    .click();
  await expect(stars.locator('[aria-current="location"]')).toHaveAttribute(
    "href",
    "#home",
  );
  await expect.poll(progress).toBe(0);

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

test("cards respondem ao teclado e respeitam movimento reduzido", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/pt");
  const card = page.locator("#projects article").first();
  const link = card.getByRole("link");
  await link.focus();
  await expect(card).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, -3)");
  await expect(card.locator(".poster-frame-inner")).toHaveCSS(
    "border-top-color",
    "rgb(193, 39, 45)",
  );
  await expect(card.locator(".project-cover-icon")).toHaveCSS(
    "transform",
    "matrix(1.1, 0, 0, 1.1, 0, 0)",
  );
  await expect(card.locator("..")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: testInfo.outputPath("interactions.png") });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
  await expect(card.locator(".project-cover-icon")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(card.locator(".poster-frame-inner")).toHaveCSS(
    "border-top-color",
    "rgb(193, 39, 45)",
  );

  const stars = page.getByRole("navigation", { name: "Navegação por seções" });
  await expect(stars.locator("[aria-current] svg")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(stars.locator("[aria-current] svg")).toHaveCSS(
    "transform",
    "none",
  );
  await page
    .getByRole("button", { name: "Alternar tema claro/escuro" })
    .click();
  await page.keyboard.press("Tab");
  await link.focus();
  await expect(card.locator(".poster-frame-inner")).toHaveCSS(
    "border-top-color",
    "rgb(142, 27, 27)",
  );
});

test("navegação por toque funciona sem efeitos de hover", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/en");
    const stars = page.getByRole("navigation", { name: "Section navigation" });
    await stars.getByRole("link", { name: "Go to Contact", exact: true }).tap();
    await expect(stars.locator("[aria-current]")).toHaveAttribute(
      "href",
      "#contact",
    );
    const card = page.locator("#projects article").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect(card.locator(".project-cover-icon")).toHaveCSS(
      "transform",
      "none",
    );
    await expect(card.locator(".poster-frame-inner")).toHaveCSS(
      "border-top-color",
      "rgb(179, 168, 147)",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
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
  await page.getByRole("button", { name: "Vue 3", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Vue 3", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
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
  await expect(page.locator("#about img")).toBeVisible();
  await expect(
    page.locator("#projects article").first().locator(".."),
  ).toHaveCSS("opacity", "1");
  await context.close();
});
