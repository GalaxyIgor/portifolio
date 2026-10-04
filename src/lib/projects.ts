import { projects, type Project } from "@/data/projects";

export function getProjects(list: Project[] = projects): Project[] {
  return [...list].sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(list: Project[] = projects): Project[] {
  return getProjects(list).filter((p) => p.featured);
}

export function getProject(
  slug: string,
  list: Project[] = projects,
): Project | undefined {
  return list.find((p) => p.slug === slug);
}

/** Projeto seguinte na ordem da lista, voltando ao primeiro no final. */
export function getNextProject(
  slug: string,
  list: Project[] = projects,
): Project | undefined {
  const ordered = getProjects(list);
  const index = ordered.findIndex((p) => p.slug === slug);
  if (index === -1 || ordered.length < 2) return undefined;
  return ordered[(index + 1) % ordered.length];
}

/** Todas as tecnologias usadas, em ordem de frequência. */
export function getStackTags(list: Project[] = projects): string[] {
  const counts = new Map<string, number>();
  for (const p of list) {
    for (const tag of p.stack) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}
