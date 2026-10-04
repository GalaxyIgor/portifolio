import type { Locale } from "@/i18n/routing";

type SkillGroup = {
  id: string;
  label: Record<Locale, string>;
  items: string[];
};

// TODO(Igor): ajuste para refletir o que você realmente usa.
export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    label: { pt: "Base", en: "Core" },
    items: ["HTML semântico", "CSS moderno", "JavaScript", "TypeScript"],
  },
  {
    id: "frameworks",
    label: { pt: "Frameworks", en: "Frameworks" },
    items: ["React", "Next.js", "Vite"],
  },
  {
    id: "styling",
    label: { pt: "Estilo e motion", en: "Styling & motion" },
    items: ["Tailwind CSS", "CSS Modules", "Motion", "Three.js / R3F"],
  },
  {
    id: "quality",
    label: { pt: "Qualidade", en: "Quality" },
    items: ["Vitest", "Testing Library", "Playwright", "Acessibilidade (WCAG)"],
  },
  {
    id: "tooling",
    label: { pt: "Ferramentas", en: "Tooling" },
    items: ["Git", "Figma", "ESLint / Prettier", "Vercel"],
  },
];
