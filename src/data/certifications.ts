export type Certification = {
  name: string;
  issuer: string;
  date: string | null; // AAAA-MM
};

// Mais recente primeiro.
export const certifications: Certification[] = [
  {
    name: "Introduction to Model Context Protocol",
    issuer: "Anthropic",
    date: "2026-08",
  },
  { name: "Claude 101", issuer: "Anthropic", date: "2026-04" },
  { name: "React Foundations for Next.js", issuer: "Vercel", date: "2026-03" },
  { name: "DevOps & Agile Culture", issuer: "FIAP", date: "2026-02" },
  { name: "Aprendendo com Python", issuer: "Enap", date: "2026-02" },
  { name: "LaTeX", issuer: "FGV Online", date: "2026-02" },
  {
    name: "Introdução à Programação Orientada a Objetos",
    issuer: "Fundação Bradesco",
    date: "2026-01",
  },
  { name: "Gestão Ágil com Scrum", issuer: "Inatel", date: "2023-05" },
  {
    name: "Python e Inteligência Artificial",
    issuer: "Inatel",
    date: "2023-04",
  },
  {
    name: "OKR — Objectives and Key Results",
    issuer: "Inatel",
    date: "2023-04",
  },
  {
    name: "Advanced Course in English (C1/C2)",
    issuer: "Uptake Idiomas",
    date: null,
  },
];
