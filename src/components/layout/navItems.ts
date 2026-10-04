export const sectionIds = [
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];
