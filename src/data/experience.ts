import type { Locale } from "@/i18n/routing";

export type ExperienceItem = {
  company: string;
  start: string; // AAAA-MM
  end: string | null; // null = atual
  role: Record<Locale, string>;
  summary: Record<Locale, string>;
};

// TODO(Igor): substitua pelos seus cargos reais (mais recente primeiro).
export const experience: ExperienceItem[] = [
  {
    company: "Empresa Atual",
    start: "2024-03",
    end: null,
    role: { pt: "Desenvolvedor Frontend", en: "Frontend Developer" },
    summary: {
      pt: "Descreva aqui o produto, seu papel e uma ou duas entregas de que você se orgulha.",
      en: "Describe the product, your role and one or two things you shipped and are proud of.",
    },
  },
  {
    company: "Empresa Anterior",
    start: "2022-06",
    end: "2024-02",
    role: {
      pt: "Desenvolvedor Frontend Júnior",
      en: "Junior Frontend Developer",
    },
    summary: {
      pt: "Mesma ideia: contexto, responsabilidade e impacto em poucas linhas.",
      en: "Same idea: context, responsibility and impact in a few lines.",
    },
  },
  {
    company: "Sua Faculdade",
    start: "2019-02",
    end: "2023-12",
    role: {
      pt: "Graduação em Ciência da Computação",
      en: "B.Sc. in Computer Science",
    },
    summary: {
      pt: "Formação, cursos ou certificações relevantes.",
      en: "Degree, courses or relevant certifications.",
    },
  },
];
