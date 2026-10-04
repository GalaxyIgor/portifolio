import { describe, expect, it } from "vitest";
import {
  findSkill,
  getSkillConnections,
  skillAnchor,
} from "@/lib/skillConnections";

describe("conexões das skills", () => {
  it("relaciona TypeScript aos projetos e à experiência cadastrada", () => {
    const connections = getSkillConnections("typescript");
    expect(connections.projects.map((project) => project.slug)).toEqual([
      "muscleai",
      "splitcut",
    ]);
    expect(connections.experience.map((entry) => entry.id)).toEqual(["upvox"]);
  });

  it("não inventa equivalência entre tecnologias ou evidências ausentes", () => {
    expect(getSkillConnections("React")).toEqual({
      projects: [],
      experience: [],
    });
    expect(getSkillConnections("Vitest")).toEqual({
      projects: [],
      experience: [],
    });
    expect(
      getSkillConnections("JavaScript").projects.map((p) => p.slug),
    ).toEqual(["beststop"]);
  });

  it("encontra uma skill e produz uma âncora estável", () => {
    expect(findSkill(" Next.js ")).toBe("Next.js");
    expect(findSkill("React Native")).toBeUndefined();
    expect(skillAnchor("Acessibilidade (WCAG)")).toBe(
      "skill-acessibilidade-wcag",
    );
  });
});
