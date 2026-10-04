import { expect, test } from "@playwright/test";

test("modal prende o foco, navega circularmente e fecha com Escape e fundo", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const first = page.getByRole("button", {
    name: "Abrir imagem: Tela de teste A",
  });
  await first.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("img")).toHaveCSS(
    "animation-name",
    "chapter-fade",
  );
  await expect(
    page.getByRole("button", { name: "Fechar galeria" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Próximo", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Fechar galeria" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(modal.getByRole("img")).toHaveAttribute(
    "alt",
    "Imagem de teste B",
  );
  await expect(modal.getByRole("status")).toHaveText("3 de 3");
  await expect(modal.getByRole("img")).toHaveCSS(
    "animation-name",
    "chapter-fade",
  );
  await page.keyboard.press("ArrowRight");
  await expect(modal.getByRole("img")).toHaveAttribute(
    "alt",
    "Imagem de teste A",
  );
  await page.screenshot({ path: testInfo.outputPath("gallery-dark.png") });
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(first).toBeFocused();
  await first.click();
  await modal.getByRole("img").click();
  await expect(modal).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(modal).not.toBeVisible();
  await expect(first).toBeFocused();
});

test("vídeos têm legendas e controles nativos e param ao navegar ou fechar", async ({
  page,
}) => {
  await page.goto("/?locale=en&theme=light");
  expect(await page.locator("video").count()).toBe(0);
  const thumbnail = page.getByRole("button", {
    name: "Open video: Test video",
  });
  await thumbnail.click();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  expect(
    await video.evaluate((element: HTMLVideoElement) => element.paused),
  ).toBe(true);
  await expect(video.locator('track[srclang="en"]')).toHaveAttribute(
    "default",
    "",
  );
  await video.evaluate((element: HTMLVideoElement) => {
    window.__galleryVideo = element;
    window.__galleryPauses = 0;
    const pause = element.pause.bind(element);
    element.pause = () => {
      window.__galleryPauses++;
      pause();
    };
  });
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await page.getByRole("button", { name: "Next", exact: true }).click();
  expect(
    await page.evaluate(
      () => window.__galleryVideo.paused && window.__galleryPauses > 0,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await video.evaluate((element: HTMLVideoElement) => {
    window.__galleryVideo = element;
    window.__galleryPauses = 0;
    const pause = element.pause.bind(element);
    element.pause = () => {
      window.__galleryPauses++;
      pause();
    };
  });
  await page.getByRole("button", { name: "Close gallery" }).click();
  expect(
    await page.evaluate(
      () => window.__galleryVideo.paused && window.__galleryPauses > 0,
    ),
  ).toBe(true);
});

test("galeria vazia fica oculta e um item não mostra navegação", async ({
  page,
}) => {
  await page.goto("/?items=empty");
  await expect(
    page.getByRole("button", { name: "Depois da galeria" }),
  ).toBeVisible();
  await expect(page.locator(".project-gallery")).toHaveCount(0);
  await page.goto("/?items=single");
  await page
    .getByRole("button", { name: "Abrir imagem: Tela de teste A" })
    .click();
  await expect(page.getByRole("status")).toHaveText("1 de 1");
  await expect(page.getByRole("button", { name: "Anterior" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Próximo" })).toHaveCount(0);
});

test("imagens aceitam swipe no celular e movimento reduzido", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/?theme=light");
    await page
      .getByRole("button", { name: "Abrir imagem: Tela de teste A" })
      .tap();
    const modal = page.getByRole("dialog");
    await expect(modal).toHaveCSS("animation-name", "none");
    await expect(modal).toHaveCSS("transform", "none");
    await expect(modal.getByRole("img")).toHaveCSS("animation-name", "none");
    const stage = page.locator(".gallery-image-stage");
    const box = (await stage.boundingBox())!;
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width - 30, y: box.y + box.height / 2 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 30, y: box.y + box.height / 2 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(modal.locator("video")).toBeVisible();
    await page.getByRole("button", { name: "Anterior", exact: true }).tap();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("gallery-mobile-light.png"),
    });
  } finally {
    await context.close();
  }
});

declare global {
  interface Window {
    __galleryVideo: HTMLVideoElement;
    __galleryPauses: number;
  }
}
