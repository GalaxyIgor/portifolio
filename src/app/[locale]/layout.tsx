import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo, EB_Garamond, Pirata_One } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { profile } from "@/data/profile";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRail } from "@/components/layout/ScrollRail";
import "../globals.css";

const pirata = Pirata_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pirata",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: t("title"), template: `%s · ${profile.name}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      title: t("title"),
      description: t("description"),
      siteName: profile.name,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("nav");

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${pirata.variable} ${garamond.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <ThemeProvider>
            <a
              href="#main"
              className="fixed top-3 left-3 z-[100] -translate-y-20 rounded bg-accent px-4 py-2 font-medium text-accent-ink transition-transform focus:translate-y-0"
            >
              {t("skip")}
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <ScrollRail />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
