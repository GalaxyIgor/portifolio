import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
  ];

  return paths.map((path) => ({
    url: `${profile.siteUrl}/${routing.defaultLocale}${path}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${profile.siteUrl}/${locale}${path}`,
        ]),
      ),
    },
  }));
}
