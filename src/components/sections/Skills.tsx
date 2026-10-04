import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { HudBox } from "@/components/ui/HudBox";
import { Sparkle } from "@/components/ui/Sparkle";

/** Skills como um inventário de RPG: cada grupo é uma caixa, cada ferramenta um slot. */
export async function Skills() {
  const t = await getTranslations("skills");
  const locale = (await getLocale()) as Locale;

  return (
    <section id="skills" className="container-page py-14 md:py-16">
      <SectionHeading id="skills" title={t("title")} intro={t("intro")} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal as="li" key={group.id} delay={i * 0.05}>
            <HudBox className="h-full p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-3xl">{group.label[locale]}</h3>
                <span className="label-hud text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex min-h-14 items-center gap-2 rounded-[3px] border border-line bg-surface/60 px-3 py-2 text-base leading-tight transition-colors hover:border-accent"
                  >
                    <Sparkle className="size-2 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </HudBox>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
