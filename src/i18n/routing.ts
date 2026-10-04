import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  // Na raiz "/", o idioma vem do navegador (Accept-Language) ou da última
  // escolha salva no cookie. Línguas sem tradução caem em inglês.
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];
