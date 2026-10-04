import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { profile } from "@/data/profile";
import { buttonClasses } from "@/components/ui/button";
import { Ornament } from "@/components/ui/Ornament";
import { Barcode } from "@/components/ui/Barcode";
import { Crosshair } from "@/components/ui/Crosshair";
import { HudBox } from "@/components/ui/HudBox";
import { Sparkle } from "@/components/ui/Sparkle";
import { HeroVisual } from "@/components/three/HeroVisual";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

/**
 * Hero em forma de pôster: nome gigante ao fundo, cavaleiro em 3D na frente
 * das letras, colunas de texto miúdo nas laterais e uma faixa de HUD embaixo.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const locale = (await getLocale()) as Locale;
  const cv = profile.cv[locale];
  const year = new Date().getFullYear();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate container-page flex min-h-[calc(100dvh-4rem)] flex-col py-6 md:min-h-[48rem] md:py-8"
    >
      {/* Faixa superior, como "MEDIEVAL POSTER ✦—✦ MEDIEVAL POSTER" */}
      <div className="flex rise items-center gap-4 label-hud" style={delay(50)}>
        <span>{t("label")}</span>
        <Ornament className="flex-1 text-ink" />
        <span>{t("role")}</span>
      </div>

      <h1
        id="hero-title"
        className="relative z-0 mt-6 rise text-center font-display text-display select-none"
        style={delay(150)}
      >
        {profile.name}
      </h1>

      {/* O cavaleiro fica na frente do nome */}
      <div className="relative z-10 mx-auto -mt-[18vw] aspect-square w-full max-w-[26rem] md:absolute md:inset-x-0 md:top-[11rem] md:bottom-[6.5rem] md:mt-0 md:aspect-auto md:max-w-none">
        <HeroVisual />
      </div>

      <div className="relative z-20 mt-6 grid gap-8 md:mt-auto md:grid-cols-[minmax(0,15rem)_1fr_minmax(0,15rem)] md:items-end">
        <div className="rise" style={delay(400)}>
          <p className="mb-2 flex items-center gap-2 label-hud text-accent">
            <Sparkle className="size-2.5" />
            {t("craft")}
          </p>
          <p className="text-lg leading-snug italic">{t("thesis")}</p>
        </div>
        <div aria-hidden className="hidden md:block" />
        <div className="rise md:text-right" style={delay(500)}>
          <p className="mb-2 flex items-center gap-2 label-hud text-accent md:justify-end">
            <Sparkle className="size-2.5" />
            {t("arsenal")}
          </p>
          <p className="text-lg leading-snug">{t("arsenalList")}</p>
          <p className="mt-1 text-lg text-muted italic">{t("status")}</p>
        </div>
      </div>

      <HudBox className="relative z-20 mt-8 flex rise flex-wrap items-center gap-x-6 gap-y-4 px-4 py-3">
        <div className="flex items-center gap-4 text-ink" style={delay(600)}>
          <Barcode
            value={`${profile.name}${year}`}
            height={26}
            className="w-24"
          />
          <span className="hidden label-hud text-muted sm:inline">
            {profile.name} — {year}
          </span>
          <Crosshair className="hidden size-4 text-muted sm:block" />
        </div>
        <div className="ml-auto flex flex-wrap gap-3">
          <Link
            href={{ pathname: "/", hash: "projects" }}
            className={buttonClasses("primary")}
          >
            {t("ctaProjects")}
          </Link>
          <Link
            href={{ pathname: "/", hash: "contact" }}
            className={buttonClasses("outline")}
          >
            {t("ctaContact")}
          </Link>
          {cv && (
            <a href={cv} download className={buttonClasses("ghost")}>
              {t("ctaCv")} ↓
            </a>
          )}
        </div>
      </HudBox>
    </section>
  );
}
