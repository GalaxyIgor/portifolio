import { createRoot } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import type { ProjectMedia } from "@/data/projects";
import pt from "@/messages/pt.json";
import en from "@/messages/en.json";
import "@/app/globals.css";

// Mídias geradas apenas pela fixture; nenhuma delas integra os projetos publicados.
function testImage(label: string) {
  return URL.createObjectURL(
    new Blob(
      [
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#141313"/><path d="M180 400V180Q400 -80 620 180V400Z" stroke="#8e1b1b" fill="none" stroke-width="3"/><text x="400" y="300" text-anchor="middle" font-size="32" fill="#d9d4c7">${label} — TEST ONLY</text></svg>`,
      ],
      { type: "image/svg+xml" },
    ),
  );
}

async function testVideo() {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  const context = canvas.getContext("2d")!;
  const stream = canvas.captureStream(10);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp8",
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => chunks.push(event.data);
  const stopped = new Promise<string>((resolve) => {
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      resolve(URL.createObjectURL(new Blob(chunks, { type: "video/webm" })));
    };
  });
  recorder.start();
  let frames = 0;
  const draw = () => {
    context.fillStyle = frames % 2 ? "#3d0509" : "#141313";
    context.fillRect(0, 0, 320, 180);
    context.fillStyle = "#d9d4c7";
    context.font = "18px serif";
    context.fillText("VIDEO — TEST ONLY", 65, 95);
    if (++frames < 12) setTimeout(draw, 50);
    else recorder.stop();
  };
  draw();
  return stopped;
}

const params = new URLSearchParams(location.search);
const locale = params.get("locale") === "en" ? "en" : "pt";
document.documentElement.lang = locale;
document.documentElement.dataset.theme =
  params.get("theme") === "light" ? "light" : "dark";
document.documentElement.style.setProperty("--font-pirata", "Georgia");
document.documentElement.style.setProperty("--font-garamond", "Georgia");
document.documentElement.style.setProperty("--font-archivo", "Arial");
const imageA = testImage("A");
const media: ProjectMedia[] = [
  {
    type: "image",
    src: imageA,
    alt: { pt: "Imagem de teste A", en: "Test image A" },
    caption: { pt: "Tela de teste A", en: "Test screen A" },
  },
  {
    type: "video",
    src: await testVideo(),
    poster: imageA,
    caption: { pt: "Vídeo de teste", en: "Test video" },
    captions: {
      pt: URL.createObjectURL(
        new Blob(["WEBVTT\n\n00:00.000 --> 00:05.000\nLegenda de teste\n"], {
          type: "text/vtt",
        }),
      ),
      en: URL.createObjectURL(
        new Blob(["WEBVTT\n\n00:00.000 --> 00:05.000\nTest caption\n"], {
          type: "text/vtt",
        }),
      ),
    },
  },
  {
    type: "image",
    src: testImage("B"),
    alt: { pt: "Imagem de teste B", en: "Test image B" },
    caption: { pt: "Tela de teste B", en: "Test screen B" },
  },
];
const items =
  params.get("items") === "empty"
    ? []
    : params.get("items") === "single"
      ? [media[0]]
      : media;
createRoot(document.getElementById("root")!).render(
  <NextIntlClientProvider
    locale={locale}
    messages={locale === "pt" ? pt : en}
    timeZone="UTC"
  >
    <main className="container-page py-8">
      <a href="#root" className="ritual-link">
        Fixture de testes
      </a>
      <ProjectGallery
        media={items}
        locale={locale}
        projectTitle="Projeto de teste"
      />
      <button type="button">Depois da galeria</button>
    </main>
  </NextIntlClientProvider>,
);
