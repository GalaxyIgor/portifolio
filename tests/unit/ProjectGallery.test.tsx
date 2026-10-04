import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import type { ImgHTMLAttributes } from "react";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import type { ProjectMedia } from "@/data/projects";
import pt from "@/messages/pt.json";
import en from "@/messages/en.json";

vi.mock("next/image", () => ({
  default: ({
    fill,
    alt = "",
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    void fill;
    // O carregamento e a otimização de imagens não fazem parte destes testes de interação.
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  },
}));

const media: ProjectMedia[] = [
  {
    type: "image",
    src: "/fixtures/a.webp",
    alt: { pt: "Imagem A", en: "Image A" },
    caption: { pt: "Primeira tela", en: "First screen" },
  },
  {
    type: "video",
    src: "/fixtures/video.webm",
    caption: { pt: "Demonstração", en: "Demo" },
    captions: { pt: "/fixtures/pt.vtt", en: "/fixtures/en.vtt" },
  },
  {
    type: "image",
    src: "/fixtures/b.webp",
    alt: { pt: "Imagem B", en: "Image B" },
    caption: { pt: "Segunda tela", en: "Second screen" },
  },
];

function gallery(
  items: ProjectMedia[] | undefined = media,
  locale: "pt" | "en" = "pt",
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "pt" ? pt : en}
      timeZone="UTC"
    >
      <ProjectGallery
        media={items}
        locale={locale}
        projectTitle="Projeto de teste"
      />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      }),
    },
    close: {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close"));
      }),
    },
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
  document.documentElement.style.overflow = "";
});

describe("ProjectGallery", () => {
  it("omite a seção quando não há mídias", () => {
    const view = gallery([]);
    expect(view.container).toBeEmptyDOMElement();
    view.unmount();
    expect(
      render(<ProjectGallery locale="pt" projectTitle="Teste" />).container,
    ).toBeEmptyDOMElement();
  });

  it("abre imagens, navega circularmente e restaura o foco e a rolagem", async () => {
    const user = userEvent.setup();
    document.documentElement.style.overflow = "auto";
    gallery();
    const first = screen.getByRole("button", {
      name: "Abrir imagem: Primeira tela",
    });
    await user.click(first);
    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("open");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(
      screen.getByRole("button", { name: "Fechar galeria" }),
    ).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(modal.querySelector("img")).toHaveAttribute("alt", "Imagem B");
    expect(screen.getByRole("status")).toHaveTextContent("3 de 3");
    fireEvent.keyDown(modal, { key: "ArrowRight" });
    expect(modal.querySelector("img")).toHaveAttribute("alt", "Imagem A");
    fireEvent(modal, new Event("cancel", { cancelable: true }));
    expect(modal).not.toHaveAttribute("open");
    expect(first).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe("auto");
  });

  it("mantém um único item sem controles anterior e próximo", async () => {
    const user = userEvent.setup();
    gallery([media[0]]);
    await user.click(
      screen.getByRole("button", { name: "Abrir imagem: Primeira tela" }),
    );
    expect(
      screen.queryByRole("button", { name: "Anterior" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Próximo" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 de 1");
  });

  it("localiza o visor e pausa vídeos ao navegar ou fechar", async () => {
    const user = userEvent.setup();
    gallery(media, "en");
    expect(document.querySelector("video")).toBeNull();
    const button = screen.getByRole("button", { name: "Open video: Demo" });
    await user.click(button);
    const video = document.querySelector("video")!;
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video.querySelector('track[srclang="en"]')).toHaveAttribute(
      "default",
    );
    expect(video.querySelector('track[srclang="pt"]')).not.toHaveAttribute(
      "default",
    );
    fireEvent.keyDown(video, { key: "ArrowRight" });
    expect(screen.getByRole("status")).toHaveTextContent("2 of 3");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(document.querySelector("video")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Previous" }));
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear();
    await user.click(screen.getByRole("button", { name: "Close gallery" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(button).toHaveFocus();
  });

  it("fecha somente ao clicar no fundo", async () => {
    const user = userEvent.setup();
    gallery();
    await user.click(
      screen.getByRole("button", { name: "Abrir imagem: Primeira tela" }),
    );
    const modal = screen.getByRole("dialog");
    await user.click(modal.querySelector("figure")!);
    expect(modal).toHaveAttribute("open");
    await user.click(modal);
    expect(modal).not.toHaveAttribute("open");
  });
});
