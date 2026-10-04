import { describe, expect, it } from "vitest";
import type { Project } from "@/data/projects";
import {
  getFeaturedProjects,
  getNextProject,
  getProject,
  getProjects,
  getStackTags,
} from "@/lib/projects";

function project(
  slug: string,
  year: number,
  stack: string[],
  featured = false,
): Project {
  const text = { pt: slug, en: slug };
  return {
    slug,
    year,
    stack,
    featured,
    links: {},
    title: text,
    summary: text,
    role: text,
  };
}

const list = [
  project("a", 2022, ["React", "CSS"]),
  project("b", 2025, ["React", "Next.js"], true),
  project("c", 2024, ["Three.js"], true),
];

describe("projects", () => {
  it("ordena do mais recente para o mais antigo", () => {
    expect(getProjects(list).map((p) => p.slug)).toEqual(["b", "c", "a"]);
  });

  it("não altera a lista original", () => {
    getProjects(list);
    expect(list.map((p) => p.slug)).toEqual(["a", "b", "c"]);
  });

  it("filtra só os destaques", () => {
    expect(getFeaturedProjects(list).map((p) => p.slug)).toEqual(["b", "c"]);
  });

  it("encontra pelo slug", () => {
    expect(getProject("c", list)?.year).toBe(2024);
    expect(getProject("x", list)).toBeUndefined();
  });

  it("dá o próximo projeto e volta ao primeiro no fim", () => {
    expect(getNextProject("b", list)?.slug).toBe("c");
    expect(getNextProject("a", list)?.slug).toBe("b");
    expect(getNextProject("x", list)).toBeUndefined();
  });

  it("não há próximo com um projeto só", () => {
    expect(getNextProject("a", [list[0]])).toBeUndefined();
  });

  it("lista tecnologias por frequência e depois em ordem alfabética", () => {
    expect(getStackTags(list)).toEqual(["React", "CSS", "Next.js", "Three.js"]);
  });
});
