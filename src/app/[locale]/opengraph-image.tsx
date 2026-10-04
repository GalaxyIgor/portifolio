import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { routing } from "@/i18n/routing";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — Portfolio`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SPARKLE =
  "M12 0C12.6 6.4 17.6 11.4 24 12 17.6 12.6 12.6 17.6 12 24 11.4 17.6 6.4 12.6 0 12 6.4 11.4 11.4 6.4 12 0Z";

function Star({ size: s, color }: { size: number; color: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path d={SPARKLE} fill={color} />
    </svg>
  );
}

/** Cartão de compartilhamento com a mesma pintura e tipografia do hero. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const bone = "#d9d4c7";
  const [painting, font] = await Promise.all([
    // JPEG derivado do hero: o renderizador Open Graph não suporta WebP.
    readFile(join(process.cwd(), "public/hero/knight-share.jpg")),
    readFile(join(process.cwd(), "public/fonts/PirataOne-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        flexDirection: "column",
        padding: "56px 72px",
        background: "#0a0a0a",
        color: bone,
        fontFamily: "sans-serif",
      }}
    >
      {/* O arquivo local dispensa qualquer chamada externa ao gerar a prévia. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={`data:image/jpeg;base64,${painting.toString("base64")}`}
        width={1200}
        height={630}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1200,
          height: 630,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage:
            "linear-gradient(to bottom, rgba(10,10,10,0.65), rgba(10,10,10,0.25) 45%, rgba(10,10,10,0.94))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          right: 24,
          bottom: 24,
          display: "flex",
          border: "1px solid rgba(217,212,199,0.4)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 22,
          letterSpacing: 4,
        }}
      >
        <span>{t("label").toUpperCase()}</span>
        <div style={{ flex: 1, height: 1, background: bone, opacity: 0.6 }} />
        <Star size={30} color={bone} />
        <div style={{ flex: 1, height: 1, background: bone, opacity: 0.6 }} />
        <span>{t("role").toUpperCase()}</span>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 250,
          fontFamily: "Pirata One",
          lineHeight: 1,
        }}
      >
        {profile.name}
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontStyle: "italic",
            maxWidth: 760,
            color: bone,
          }}
        >
          {t("thesis")}
        </div>
        <Star size={56} color="#c1272d" />
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Pirata One", data: font, weight: 400, style: "normal" }],
    },
  );
}
