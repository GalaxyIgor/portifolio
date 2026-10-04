"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { HudBox } from "@/components/ui/HudBox";
import { Sparkle } from "@/components/ui/Sparkle";
import { Reveal } from "@/components/ui/Reveal";

type Skill = {
  id: string;
  name: string;
  description: string;
  projects: { slug: string; title: string }[];
  experience: { id: string; company: string; role: string }[];
};
type Props = {
  groups: { id: string; label: string; items: Skill[] }[];
  labels: Record<
    "connections" | "projects" | "experience" | "choose" | "hint" | "empty",
    string
  >;
};

/** Inventário e painel de evidências: a moldura permanece durante a troca. */
export function SkillInventory({ groups, labels }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const skill = groups
    .flatMap((group) => group.items)
    .find((item) => item.id === selected);
  useEffect(() => {
    const selectFromHash = () => {
      const focused = document.activeElement?.closest(".skill-slot")?.id;
      const hovered = window.matchMedia("(hover: hover) and (pointer: fine)")
        .matches
        ? document
            .querySelector(".skill-selector:hover")
            ?.closest(".skill-slot")?.id
        : undefined;
      // Restaura também hover/foco ocorridos antes de concluir a hidratação.
      const hash = window.location.hash.slice(1);
      const id = hash.startsWith("skill-") ? hash : (focused ?? hovered);
      if (
        id &&
        groups.some((group) => group.items.some((item) => item.id === id))
      )
        setSelected(id);
    };
    const frame = requestAnimationFrame(selectFromHash);
    window.addEventListener("hashchange", selectFromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", selectFromHash);
    };
  }, [groups]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-12">
      <ul className="grid gap-6 sm:grid-cols-2">
        {groups.map((group, index) => (
          <Reveal as="li" key={group.id} delay={index * 0.05}>
            <HudBox className="h-full p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-display text-3xl">{group.label}</h3>
                <span className="label-hud text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <li key={item.id} id={item.id} className="skill-slot min-w-0">
                    <button
                      type="button"
                      className="skill-selector ritual-control flex min-h-14 w-full items-center gap-2 border border-line bg-surface/60 px-3 py-2 text-left text-base leading-tight"
                      aria-pressed={selected === item.id}
                      aria-controls={panelId}
                      onPointerMove={(event) => {
                        if (
                          event.pointerType === "mouse" &&
                          window.matchMedia(
                            "(hover: hover) and (pointer: fine)",
                          ).matches
                        )
                          setSelected(item.id);
                      }}
                      onFocus={() => setSelected(item.id)}
                      onClick={() => {
                        setSelected(item.id);
                        if (window.matchMedia("(hover: none)").matches)
                          panel.current?.scrollIntoView({
                            behavior: reduce ? "auto" : "smooth",
                            block: "center",
                          });
                      }}
                    >
                      <Sparkle className="size-2 shrink-0 text-accent" />
                      <span className="min-w-0 flex-1">{item.name}</span>
                      {item.projects.length + item.experience.length > 0 && (
                        <span
                          aria-hidden="true"
                          className="label-hud text-accent"
                        >
                          {item.projects.length + item.experience.length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </HudBox>
          </Reveal>
        ))}
      </ul>
      <div
        ref={panel}
        id={panelId}
        role="region"
        aria-label={labels.connections}
        className="skill-connections-panel min-w-0 lg:sticky lg:top-24"
      >
        <HudBox className="min-h-80 border-accent/60 bg-surface/40 p-6">
          <div className="mb-6 flex items-center gap-3 label-hud text-muted">
            <Sparkle className="size-3 text-accent" />
            <span>{labels.connections}</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={skill?.id ?? "choose"}
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -4 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            >
              <h3 className="font-display text-4xl">
                {skill?.name ?? labels.choose}
              </h3>
              {skill?.description && (
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  {skill.description}
                </p>
              )}
              {!skill ? (
                <p className="mt-4 text-lg text-muted">{labels.hint}</p>
              ) : (
                <>
                  {skill.projects.length > 0 && (
                    <div className="mt-6">
                      <p className="label-hud text-muted">{labels.projects}</p>
                      <ul className="mt-3 space-y-3">
                        {skill.projects.map((project) => (
                          <li key={project.slug}>
                            <Link
                              href={`/projects/${project.slug}`}
                              className="ritual-link text-xl text-accent"
                            >
                              {project.title} ↗
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {skill.experience.length > 0 && (
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="label-hud text-muted">
                        {labels.experience}
                      </p>
                      <ul className="mt-3 space-y-3">
                        {skill.experience.map((entry) => (
                          <li key={entry.id}>
                            <a
                              href={`#experience-${entry.id}`}
                              className="ritual-link text-xl text-accent"
                            >
                              {entry.company} ↘
                            </a>
                            <p className="mt-1 text-base text-muted">
                              {entry.role}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!skill.projects.length && !skill.experience.length && (
                    <p className="mt-4 text-lg text-muted">{labels.empty}</p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </HudBox>
        <p role="status" className="sr-only">
          {skill?.name ?? ""}
        </p>
      </div>
    </div>
  );
}
