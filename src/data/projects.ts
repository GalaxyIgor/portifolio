import type { Locale } from "@/i18n/routing";

export type Project = {
  slug: string;
  year: number;
  featured: boolean;
  stack: string[];
  links: { demo?: string; code?: string };
  // Caminho em /public. Sem capa, o card mostra um wireframe gerado.
  cover?: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  role: Record<Locale, string>;
};

// TODO(Igor): estes são projetos de exemplo. Troque pelos seus e
// crie o MDX correspondente em src/content/projects/{pt,en}/<slug>.mdx.
export const projects: Project[] = [
  {
    slug: "design-system",
    year: 2025,
    featured: true,
    stack: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
    links: { code: "https://github.com/seu-usuario/design-system" },
    title: { pt: "Design system", en: "Design system" },
    summary: {
      pt: "Biblioteca de componentes acessíveis com tokens compartilhados entre design e código.",
      en: "Accessible component library with tokens shared between design and code.",
    },
    role: {
      pt: "Desenvolvimento e documentação",
      en: "Development and documentation",
    },
  },
  {
    slug: "dashboard-financeiro",
    year: 2025,
    featured: true,
    stack: ["Next.js", "TypeScript", "TanStack Query", "Recharts"],
    links: {
      demo: "https://exemplo.vercel.app",
      code: "https://github.com/seu-usuario/dashboard",
    },
    title: { pt: "Dashboard financeiro", en: "Finance dashboard" },
    summary: {
      pt: "Painel de gastos pessoais com gráficos interativos, filtros por período e modo offline.",
      en: "Personal spending dashboard with interactive charts, date filters and offline mode.",
    },
    role: {
      pt: "Projeto pessoal, ponta a ponta",
      en: "Personal project, end to end",
    },
  },
  {
    slug: "galeria-3d",
    year: 2024,
    featured: true,
    stack: ["React", "Three.js", "R3F", "Vite"],
    links: { demo: "https://exemplo-3d.vercel.app" },
    title: { pt: "Galeria 3D", en: "3D gallery" },
    summary: {
      pt: "Galeria navegável em WebGL com fallback leve para aparelhos sem GPU.",
      en: "Navigable WebGL gallery with a lightweight fallback for devices without a GPU.",
    },
    role: { pt: "Projeto de estudo", en: "Study project" },
  },
];
