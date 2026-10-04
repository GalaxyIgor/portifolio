"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

type Props = {
  projects: Project[];
  tags: string[];
  locale: Locale;
  labels: { filter: string; all: string; empty: string; cta: string };
};

export function ProjectGrid({ projects, tags, locale, labels }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active
    ? projects.filter((p) => p.stack.includes(active))
    : projects;

  const chip = (selected: boolean) =>
    `rounded-[2px] border px-3 py-1.5 label-hud transition-colors ${
      selected
        ? "border-accent bg-accent text-accent-ink"
        : "border-line text-muted hover:border-ink hover:text-ink"
    }`;

  return (
    <>
      <div
        role="group"
        aria-label={labels.filter}
        className="mb-14 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={chip(active === null)}
        >
          {labels.all}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={active === tag}
            onClick={() => setActive(active === tag ? null : tag)}
            className={chip(active === tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-xl text-muted italic">{labels.empty}</p>
      ) : (
        <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} locale={locale} cta={labels.cta} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
