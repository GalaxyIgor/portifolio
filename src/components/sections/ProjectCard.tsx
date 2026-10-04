import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/data/projects";
import { ProjectCover } from "@/components/ui/ProjectCover";

type Props = { project: Project; locale: Locale; cta: string };

/** Card como mini-pôster: título por cima da capa, legendas em HUD. */
export function ProjectCard({ project, locale, cta }: Props) {
  const title = project.title[locale];

  return (
    <article className="project-card group relative flex h-full flex-col">
      <div className="mb-2 flex justify-between label-hud text-muted">
        <span>{project.year}</span>
        <span>{project.stack[0]}</span>
      </div>
      <h3 className="project-card-title mb-3 font-display text-[2.75rem] leading-[0.95]">
        {/* O ::after estica o link sobre o card inteiro */}
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0"
        >
          {title}
        </Link>
      </h3>
      <ProjectCover slug={project.slug} title={title} cover={project.cover} />
      <p className="mt-4 text-lg leading-snug text-muted">
        {project.summary[locale]}
      </p>
      <p className="mt-4 label-hud text-muted">{project.stack.join(" · ")}</p>
      <span aria-hidden className="project-card-cta mt-5 label-hud text-accent">
        {cta} →
      </span>
    </article>
  );
}
