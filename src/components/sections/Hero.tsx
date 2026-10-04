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
 * Hero em forma de pôster sobre uma cena em parallax: o nome fica entre o céu
 * e o cavaleiro. O bloco é sempre escuro (data-theme="dark"), como uma
 * pintura, independente do tema da página.
 */
export async function Hero() {
  const t = await getTranslations("hero");
  const locale = (await getLocale()) as Locale;
  const cv = profile.cv[locale];
  const year = new Date().getFullYear();

  return (
    <section
      data-theme="dark"
      aria-labelledby="hero-title"
      className="relative isolate h-[calc(100svh-4rem)] min-h-[36rem] overflow-hidden text-ink"
    >
      <HeroVisual name={profile.name} imageAlt={t("imageAlt")} />

      <div className="pointer-events-none relative z-10 container-page flex h-full flex-col py-6 md:py-8">
        {/* Faixa superior, como "MEDIEVAL POSTER ✦—✦ MEDIEVAL POSTER" */}
        <div
          className="flex rise items-center gap-4 label-hud"
          style={delay(50)}
        >
          <span>{t("label")}</span>
          <Ornament className="flex-1" />
          <span>{t("role")}</span>
        </div>

        <div className="mt-auto grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr_minmax(0,16rem)] md:items-end">
          <div className="rise" style={delay(400)}>
            <p className="mb-2 flex items-center gap-2 label-hud text-accent">
              <Sparkle className="size-2.5" />
              {t("craft")}
            </p>
            <p className="text-lg leading-snug italic">{t("thesis")}</p>
          </div>
          <div aria-hidden className="hidden md:block" />
          <div
            className="hidden rise md:block md:text-right"
            style={delay(500)}
          >
            <p className="mb-2 flex items-center gap-2 label-hud text-accent md:justify-end">
              <Sparkle className="size-2.5" />
              {t("arsenal")}
            </p>
            <p className="text-lg leading-snug">{t("arsenalList")}</p>
            <p className="mt-1 text-lg text-muted italic">{t("status")}</p>
          </div>
        </div>

        <HudBox className="pointer-events-auto mt-6 flex rise flex-wrap items-center gap-x-6 gap-y-4 bg-black/30 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-4" style={delay(600)}>
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
      </div>
    </section>
  );
}
