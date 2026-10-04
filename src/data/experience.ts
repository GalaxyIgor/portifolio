import type { Locale } from "@/i18n/routing";

export type ExperienceItem = {
  id: string;
  company: string;
  stack?: string[];
  start: string; // AAAA-MM
  end: string | null; // null = atual
  role: Record<Locale, string>;
  summary: Record<Locale, string>;
};

// Mais recente primeiro.
export const experience: ExperienceItem[] = [
  {
    id: "upvox",
    company: "Upvox",
    stack: ["Next.js", "React Native", "TypeScript"],
    start: "2026-08",
    end: null,
    role: { pt: "Estagiário Next.js", en: "Next.js Intern" },
    summary: {
      pt: "Desenvolvimento web e mobile com Next.js, React Native e TypeScript.",
      en: "Web and mobile development with Next.js, React Native and TypeScript.",
    },
  },
  {
    id: "robotbulls",
    company: "Robotbulls",
    stack: ["C"],
    start: "2023-02",
    end: "2024-06",
    role: { pt: "Desenvolvedor C (voluntário)", en: "C Developer (volunteer)" },
    summary: {
      pt: "Programação em C na equipe de robótica.",
      en: "C programming for the robotics team.",
    },
  },
  {
    id: "inatel",
    company: "Inatel — Instituto Nacional de Telecomunicações",
    start: "2022-02",
    end: "2027-12",
    role: {
      pt: "Bacharelado em Engenharia da Computação",
      en: "B.Eng. in Computer Engineering",
    },
    summary: {
      pt: "Formação em engenharia, programação orientada a objetos e fundamentos de computação. Conclusão prevista para dez. de 2027.",
      en: "Engineering, object-oriented programming and computing fundamentals. Expected graduation in Dec 2027.",
    },
  },
  {
    id: "madeireira-uniao",
    company: "Madeireira União",
    stack: ["Microsoft Office"],
    start: "2020-01",
    end: "2022-12",
    role: { pt: "Assistente administrativo", en: "Administrative Assistant" },
    summary: {
      pt: "Controle de inventário e rotinas administrativas com Microsoft Office.",
      en: "Inventory control and administrative routines with Microsoft Office.",
    },
  },
];
