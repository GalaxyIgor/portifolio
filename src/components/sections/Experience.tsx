import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Sparkle } from "@/components/ui/Sparkle";

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
    <section id="experience" className="container-page py-24 md:py-36">
      <SectionHeading id="experience" title={t("title")} />
      <ol className="relative ml-2 border-l border-line">
        {experience.map((item, i) => (
          <Reveal
            as="li"
            key={`${item.company}-${item.start}`}
            delay={i * 0.05}
            className="relative pb-16 pl-8 last:pb-0 md:grid md:grid-cols-[12rem_1fr] md:gap-10 md:pl-12"
          >
            <Sparkle className="absolute top-1 -left-[9px] size-[18px] bg-bg text-accent" />
            <p className="pt-1 label-hud text-muted">
              <time dateTime={item.start}>{date(item.start)}</time>
              {" — "}
              {item.end ? (
                <time dateTime={item.end}>{date(item.end)}</time>
              ) : (
                t("present")
              )}
            </p>
            <div>
              <h3 className="mt-2 font-display text-4xl md:mt-0">
                {item.role[locale]}
              </h3>
              <p className="mt-1 text-lg text-accent italic">{item.company}</p>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
                {item.summary[locale]}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
