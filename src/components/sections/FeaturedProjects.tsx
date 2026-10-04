import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFeaturedProjects } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";
import { ProjectCard } from "./ProjectCard";

export async function FeaturedProjects() {
  const t = await getTranslations("projects");
  const locale = (await getLocale()) as Locale;
  const featured = getFeaturedProjects().slice(0, 3);

  return (
    <section id="projects" className="container-page py-14 md:py-16">
      <SectionHeading id="projects" title={t("title")} intro={t("intro")} />
      <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.08}>
            <ProjectCard
              project={project}
              locale={locale}
              cta={t("viewCase")}
            />
          </Reveal>
        ))}
      </ul>
      <div className="mt-16 flex justify-center">
        <Link href="/projects" className={buttonClasses("outline")}>
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
