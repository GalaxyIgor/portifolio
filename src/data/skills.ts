import type { Locale } from "@/i18n/routing";

type SkillGroup = {
  id: string;
  label: Record<Locale, string>;
  items: string[];
};

export const skillDescriptions: Record<string, Record<Locale, string>> = {
  "HTML semântico": {
    pt: "Linguagem que estrutura páginas com elementos que descrevem o significado do conteúdo.",
    en: "Markup language that structures pages with elements describing the meaning of their content.",
  },
  "CSS moderno": {
    pt: "Linguagem de estilos que define cores, tipografia, layouts e a adaptação a diferentes telas.",
    en: "Style language that defines colors, typography, layouts and adaptation to different screens.",
  },
  JavaScript: {
    pt: "Linguagem de programação que cria interações e comportamentos nas páginas e aplicações.",
    en: "Programming language for interactions and behavior in pages and applications.",
  },
  TypeScript: {
    pt: "JavaScript com tipos, ajudando a identificar erros e organizar aplicações maiores.",
    en: "JavaScript with types, helping catch errors and organize larger applications.",
  },
  React: {
    pt: "Biblioteca para construir interfaces a partir de componentes reutilizáveis.",
    en: "Library for building interfaces from reusable components.",
  },
  "Next.js": {
    pt: "Framework baseado em React para criar aplicações web com rotas e renderização no servidor.",
    en: "React-based framework for web applications with routing and server rendering.",
  },
  Vite: {
    pt: "Ferramenta para executar e compilar projetos web, com atualizações rápidas durante o desenvolvimento.",
    en: "Tool for running and building web projects, with fast updates during development.",
  },
  "Tailwind CSS": {
    pt: "Framework de CSS com classes utilitárias para compor o visual diretamente nos componentes.",
    en: "CSS framework with utility classes for styling directly in components.",
  },
  "CSS Modules": {
    pt: "Forma de organizar estilos CSS com nomes de classe restritos a cada componente.",
    en: "Way to organize CSS styles with class names scoped to each component.",
  },
  Motion: {
    pt: "Biblioteca para criar animações, gestos e transições de interfaces.",
    en: "Library for interface animations, gestures and transitions.",
  },
  "Three.js / R3F": {
    pt: "Ferramentas para criar cenas 3D no navegador e integrá-las a componentes React.",
    en: "Tools for creating 3D scenes in the browser and integrating them with React components.",
  },
  Vitest: {
    pt: "Ferramenta de testes automatizados para verificar funções e componentes.",
    en: "Automated testing tool for checking functions and components.",
  },
  "Testing Library": {
    pt: "Conjunto de ferramentas para testar interfaces pela perspectiva de quem as usa.",
    en: "Tools for testing interfaces from the user's perspective.",
  },
  Playwright: {
    pt: "Ferramenta para automatizar navegadores e testar fluxos completos de uma aplicação.",
    en: "Tool for automating browsers and testing complete application flows.",
  },
  "Acessibilidade (WCAG)": {
    pt: "Diretrizes para tornar interfaces utilizáveis por pessoas com diferentes necessidades.",
    en: "Guidelines for making interfaces usable by people with different needs.",
  },
  Git: {
    pt: "Sistema de controle de versões que registra alterações e facilita o trabalho em equipe.",
    en: "Version control system that tracks changes and supports collaboration.",
  },
  Figma: {
    pt: "Ferramenta de design colaborativo para criar layouts, componentes e protótipos.",
    en: "Collaborative design tool for layouts, components and prototypes.",
  },
  "ESLint / Prettier": {
    pt: "Ferramentas para identificar problemas no código e manter sua formatação consistente.",
    en: "Tools for finding code issues and keeping formatting consistent.",
  },
  Vercel: {
    pt: "Plataforma para publicar aplicações web e gerar prévias de alterações.",
    en: "Platform for deploying web applications and previewing changes.",
  },
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
