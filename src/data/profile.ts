import type { Locale } from "@/i18n/routing";

// TODO(Igor): preencha com seus dados reais.
export const profile = {
  name: "Igor",
  email: "igornbelisario@gmail.com",
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://portifolio-delta-one-12.vercel.app"
  ).replace(/\/$/, ""),
  // Coloque os PDFs em /public e informe o caminho. null esconde o botão.
  cv: { pt: null, en: null } as Record<Locale, string | null>,
  // Caminho da foto em /public. null mostra o monograma.
  photo: "/igor.webp" as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/GalaxyIgor" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/igorbelisario/" },
  ],
};
