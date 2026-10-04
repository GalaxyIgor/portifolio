import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getProjects, getStackTags } from "@/lib/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/sections/ProjectGrid";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { pt: "/pt/projects", en: "/en/projects" },
    },
  };
}

export default async function ProjectsPage({
  params,
}: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = getProjects();

  return (
    <div className="container-page py-20 md:py-28">
      <SectionHeading
        as="h1"
        id="projects"
        title={t("title")}
        intro={t("intro")}
      />
      <ProjectGrid
        projects={projects}
        tags={getStackTags(projects)}
        locale={locale as Locale}
        labels={{
          filter: t("filterLabel"),
          all: t("filterAll"),
          empty: t("empty"),
          cta: t("viewCase"),
        }}
      />
    </div>
  );
}
