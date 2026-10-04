import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { experience } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SkillLinks } from "@/components/ui/SkillLinks";
import { ExperienceStep } from "./ExperienceStep";

export async function Experience() {
  const t = await getTranslations("experience");
  const locale = (await getLocale()) as Locale;
  const format = await getFormatter();

  const date = (value: string) =>
    format.dateTime(new Date(`${value}-01T12:00:00`), {
      month: "short",
      year: "numeric",
    });

  return (
    <section id="experience" className="container-page py-14 md:py-16">
      <SectionHeading id="experience" title={t("title")} />
      <ol className="relative ml-2 border-l border-line">
        {experience.map((item) => (
          <ExperienceStep
            key={`${item.company}-${item.start}`}
            date={
              <>
                <time dateTime={item.start}>{date(item.start)}</time>
                {" — "}
                {item.end ? (
                  <time dateTime={item.end}>{date(item.end)}</time>
                ) : (
                  t("present")
                )}
              </>
            }
          >
            <div id={`experience-${item.id}`} className="experience-entry">
              <h3 className="mt-2 font-display text-4xl md:mt-0">
                {item.role[locale]}
              </h3>
              <p className="mt-1 text-lg text-accent italic">{item.company}</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
                {item.summary[locale]}
              </p>
              {item.stack?.length ? (
                <div className="mt-4">
                  <SkillLinks stack={item.stack} />
                </div>
              ) : null}
            </div>
          </ExperienceStep>
        ))}
      </ol>

      <div className="mt-20 md:mt-24">
        <h3 className="mb-8 font-display text-4xl">{t("certifications")}</h3>
        <ul className="grid gap-x-10 border-t border-line sm:grid-cols-2">
          {certifications.map((cert, index) => (
            <Reveal
              as="li"
              key={cert.name}
              delay={(index % 2) * 0.06}
              className="certification-row relative flex items-baseline justify-between gap-4 border-b border-line py-4"
            >
              <div>
                <p className="certification-name text-lg">{cert.name}</p>
                <p className="text-accent italic">{cert.issuer}</p>
              </div>
              {cert.date && (
                <time
                  dateTime={cert.date}
                  className="shrink-0 label-hud text-muted"
                >
                  {date(cert.date)}
                </time>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
