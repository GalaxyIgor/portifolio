import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = profile.name;

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

/** Pôster preto com o nome, no estilo do hero. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const bone = "#d9d4c7";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        background: "#0a0a0a",
        color: bone,
        fontFamily: "serif",
      }}
    >
      <div
        style={{
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
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 260,
          lineHeight: 1,
        }}
      >
        {profile.name}
      </div>
      <div
        style={{
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
            color: "#8b867c",
          }}
        >
          {t("thesis")}
        </div>
        <Star size={56} color="#c1272d" />
      </div>
    </div>,
    size,
  );
}
