import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PosterFrame } from "@/components/ui/PosterFrame";
import { HudBox } from "@/components/ui/HudBox";
import { HelmIcon } from "@/components/ui/icons";

export async function About() {
  const t = await getTranslations("about");
  const facts = [
    { label: t("facts.location"), value: t("facts.locationValue") },
    { label: t("facts.focus"), value: t("facts.focusValue") },
    { label: t("facts.status"), value: t("facts.statusValue") },
  ];

  return (
    <section id="about" className="container-page py-14 md:py-16">
      <SectionHeading id="about" title={t("title")} />
      <div className="grid gap-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-20">
        <Reveal className="mx-auto w-full max-w-[18rem] md:max-w-none">
          <PosterFrame className="aspect-[3/4]">
            {profile.photo ? (
              <Image
                src={profile.photo}
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 768px) 22rem, 18rem"
                className="object-cover grayscale-[0.3]"
              />
            ) : (
              <div className="grid size-full place-items-center text-muted">
                <HelmIcon className="size-28 stroke-[0.6]" />
              </div>
            )}
          </PosterFrame>
        </Reveal>

        <div>
          <Reveal className="max-w-2xl space-y-6 text-xl leading-relaxed">
            {/* Capitular, como num manuscrito */}
            <p className="first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-[5.5rem] first-letter:leading-[0.75] first-letter:text-accent">
              {t("p1")}
            </p>
            <p className="text-muted">{t("p2")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <HudBox className="mt-14">
              <dl className="grid divide-line sm:grid-cols-3 sm:divide-x">
                {facts.map((fact) => (
                  <div key={fact.label} className="px-5 py-4">
                    <dt className="label-hud text-muted">{fact.label}</dt>
                    <dd className="mt-1.5 text-lg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </HudBox>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
