import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skillGroups } from "@/data/skills";

const normalize = (value: string) => value.trim().toLowerCase();

export function skillAnchor(skill: string) {
  return `skill-${normalize(skill)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/** Relações vêm das tecnologias cadastradas; React Native não implica React. */
export function getSkillConnections(skill: string) {
  const matches = (stack: string[]) =>
    stack.some((technology) => normalize(technology) === normalize(skill));
  return {
    projects: projects.filter((project) => matches(project.stack)),
    experience: experience.filter((item) => matches(item.stack ?? [])),
  };
}

export function findSkill(technology: string) {
  return skillGroups
    .flatMap((group) => group.items)
    .find((skill) => normalize(skill) === normalize(technology));
}
