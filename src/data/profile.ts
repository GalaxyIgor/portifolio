import type { Locale } from "@/i18n/routing";

// TODO(Igor): preencha com seus dados reais.
export const profile = {
  name: "Igor",
  email: "seu-email@exemplo.com",
  siteUrl: "https://seu-dominio.dev",
  // Coloque os PDFs em /public e informe o caminho. null esconde o botão.
  cv: { pt: null, en: null } as Record<Locale, string | null>,
  // Coloque a foto em /public/images/igor.jpg. null mostra o monograma.
  photo: null as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/GalaxyIgor" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/igorbelisario/" },
  ],
};
