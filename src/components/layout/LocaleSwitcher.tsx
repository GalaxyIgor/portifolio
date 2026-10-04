"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center label-hud"
    >
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="px-0.5 text-line">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-label={t(locale)}
            aria-current={locale === current ? "true" : undefined}
            className="ritual-link px-1.5 py-1 text-muted uppercase aria-[current]:text-ink"
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}
