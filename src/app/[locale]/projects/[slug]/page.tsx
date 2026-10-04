import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { projects } from "@/data/projects";
import { getNextProject, getProject } from "@/lib/projects";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Sparkle } from "@/components/ui/Sparkle";
import { buttonClasses } from "@/components/ui/button";
import { profile } from "@/data/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const l = locale as Locale;
  return {
    title: project.title[l],
    description: project.summary[l],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((other) => [other, `/${other}/projects/${slug}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: `/${locale}/projects/${slug}`,
      title: project.title[l],
      description: project.summary[l],
      images: [
        {
          url: `${profile.siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${profile.name} — Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title[l],
      description: project.summary[l],
      images: [`/${locale}/opengraph-image`],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  const l = locale as Locale;
  const t = await getTranslations("projects");
  const next = getNextProject(slug);
  const { default: Body } = await import(`@/content/projects/${l}/${slug}.mdx`);

  return (
    <article className="container-page py-16 md:py-24">
      <Link
        href="/projects"
        className="label-hud text-muted transition-colors hover:text-accent"
      >
        ← {t("back")}
      </Link>

      <header className="mt-12 grid gap-12 md:grid-cols-[1fr_minmax(0,22rem)] md:gap-16">
        <div>
          <div
            aria-hidden
            className="mb-6 flex items-center gap-3 label-hud text-muted"
          >
            <Sparkle className="size-3 text-accent" />
            <span>#{project.slug}</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="font-display text-title">{project.title[l]}</h1>
          <p className="mt-6 max-w-xl text-2xl leading-snug text-muted italic">
            {project.summary[l]}
          </p>

          <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <dt className="label-hud text-muted">{t("year")}</dt>
              <dd className="mt-1 text-lg">{project.year}</dd>
            </div>
            <div>
              <dt className="label-hud text-muted">{t("role")}</dt>
              <dd className="mt-1 text-lg">{project.role[l]}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="label-hud text-muted">{t("stack")}</dt>
              <dd className="mt-1 text-lg">{project.stack.join(" · ")}</dd>
            </div>
          </dl>

          {(project.links.demo || project.links.code) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClasses("primary")}
                >
                  {t("demo")} ↗
                </a>
              )}
              {project.links.code && (
                <a
                  href={project.links.code}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonClasses("outline")}
                >
                  {t("code")} ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-[18rem] md:max-w-none">
          <ProjectCover
            slug={project.slug}
            title={project.title[l]}
            cover={project.cover}
            priority
          />
        </div>
      </header>

      <ProjectGallery
        media={project.gallery}
        locale={l}
        projectTitle={project.title[l]}
      />

      <div className="mt-20 max-w-2xl border-t border-line pt-16">
        <Body />
      </div>

      {next && (
        <nav className="mt-24 border-t border-line pt-10">
          <Link href={`/projects/${next.slug}`} className="group block">
            <span className="label-hud text-muted">{t("next")}</span>
            <span className="mt-2 block font-display text-5xl transition-colors group-hover:text-accent">
              {next.title[l]} →
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
