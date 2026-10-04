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

// Cada projeto tem seu MDX em src/content/projects/{pt,en}/<slug>.mdx.
export const projects: Project[] = [
  {
    slug: "beststop",
    year: 2025,
    featured: true,
    stack: ["JavaScript", "HTML5", "Visão computacional", "IA"],
    links: {},
    title: { pt: "BestStop", en: "BestStop" },
    summary: {
      pt: "Visão computacional que analisa câmeras de estacionamento e recomenda as melhores vagas em tempo real.",
      en: "Computer vision that reads parking-lot cameras and recommends the best spots in real time.",
    },
    role: {
      pt: "Fetin do Inatel · com Fuad e Caio",
      en: "Inatel's Fetin fair · with Fuad and Caio",
    },
  },
  {
    slug: "muscleai",
    year: 2025,
    featured: true,
    stack: ["React Native", "Expo", "TypeScript", "IA"],
    links: {},
    title: { pt: "MuscleAi", en: "MuscleAi" },
    summary: {
      pt: "App Android que usa visão computacional e IA para montar treinos personalizados.",
      en: "Android app that uses computer vision and AI to build personalized workouts.",
    },
    role: {
      pt: "Com Tobias, Caio e mais 1 pessoa",
      en: "With Tobias, Caio and one more",
    },
  },
  {
    slug: "easyrent",
    year: 2025,
    featured: true,
    stack: ["Flutter", "Dart", "Android", "Windows"],
    links: {},
    title: { pt: "EasyRent", en: "EasyRent" },
    summary: {
      pt: "Gestão de aluguéis digital e simples, com versões para Android e Windows.",
      en: "Simple, digital rental management, with Android and Windows versions.",
    },
    role: { pt: "Em desenvolvimento", en: "In progress" },
  },
  {
    slug: "splitcut",
    year: 2026,
    featured: false,
    stack: ["Electron", "Vue 3", "TypeScript", "SQLite", "FFmpeg"],
    links: {},
    title: { pt: "SplitCut", en: "SplitCut" },
    summary: {
      pt: "App desktop para editar e cortar vídeos, com dados guardados localmente, sem nuvem.",
      en: "Desktop app for editing and cutting videos, with data stored locally, no cloud.",
    },
    role: { pt: "Projeto pessoal", en: "Personal project" },
  },
  {
    slug: "audiocam",
    year: 2025,
    featured: false,
    stack: ["TCP/IP", "UDP", "Redes"],
    links: {},
    title: { pt: "AudioCam", en: "AudioCam" },
    summary: {
      pt: "Projeto para democratizar o uso de webcams e microfones em computadores.",
      en: "A project to make webcams and microphones on computers more accessible.",
    },
    role: { pt: "Em desenvolvimento", en: "In progress" },
  },
  {
    slug: "pomodoro-app",
    year: 2025,
    featured: false,
    stack: ["Kotlin", "Android"],
    links: {},
    title: { pt: "PomodoroApp", en: "PomodoroApp" },
    summary: {
      pt: "App Android de produtividade baseado na Técnica Pomodoro, com ciclos personalizáveis e progresso.",
      en: "Android productivity app based on the Pomodoro Technique, with custom cycles and progress tracking.",
    },
    role: { pt: "Projeto pessoal", en: "Personal project" },
  },
  {
    slug: "wallpaper-app",
    year: 2025,
    featured: false,
    stack: ["Kotlin", "Android", "Banco de dados"],
    links: {},
    title: { pt: "WallpaperApp", en: "WallpaperApp" },
    summary: {
      pt: "App Android nativo com uma coleção de imagens para baixar e aplicar como papel de parede.",
      en: "Native Android app with an image collection to download and set as wallpaper.",
    },
    role: { pt: "Projeto pessoal", en: "Personal project" },
  },
  {
    slug: "cybercity",
    year: 2023,
    featured: false,
    stack: ["Desenvolvimento de jogos", "2D"],
    links: {},
    title: { pt: "CyberCity", en: "CyberCity" },
    summary: {
      pt: "Jogo de plataforma 2D com história, num futuro cyberpunk.",
      en: "Story-driven 2D platformer set in a cyberpunk future.",
    },
    role: { pt: "Projeto de estudo", en: "Study project" },
  },
  {
    slug: "recomendacao-filmes",
    year: 2023,
    featured: false,
    stack: ["C++"],
    links: {},
    title: {
      pt: "Recomendação de filmes em C++",
      en: "Movie recommender in C++",
    },
    summary: {
      pt: "Mecanismo de recomendação de filmes e séries inspirado nas plataformas de streaming.",
      en: "Movie and series recommendation engine inspired by streaming platforms.",
    },
    role: {
      pt: "Inatel · com Tobias e Caio",
      en: "Inatel · with Tobias and Caio",
    },
  },
  {
    slug: "ia-vida-marinha",
    year: 2023,
    featured: false,
    stack: ["Python", "YOLOv8", "IA"],
    links: {},
    title: { pt: "IA que analisa a vida marinha", en: "Marine life AI" },
    summary: {
      pt: "IA baseada em YOLOv8 que identifica e cataloga espécies marinhas.",
      en: "YOLOv8-based AI that identifies and catalogs marine species.",
    },
    role: { pt: "Projeto de estudo", en: "Study project" },
  },
];
