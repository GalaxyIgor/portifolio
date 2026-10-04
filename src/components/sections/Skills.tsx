import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { skillGroups, skillDescriptions } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSkillConnections, skillAnchor } from "@/lib/skillConnections";
import { SkillInventory } from "./SkillInventory";

export async function Skills() {
  const t = await getTranslations("skills");
  const locale = (await getLocale()) as Locale;
  const groups = skillGroups.map((group) => ({
    id: group.id,
    label: group.label[locale],
    items: group.items.map((name) => {
      const connections = getSkillConnections(name);
      return {
        id: skillAnchor(name),
        name,
        description: skillDescriptions[name]?.[locale] ?? "",
        projects: connections.projects.map((project) => ({
          slug: project.slug,
          title: project.title[locale],
        })),
        experience: connections.experience.map((entry) => ({
          id: entry.id,
          company: entry.company,
          role: entry.role[locale],
        })),
      };
    }),
  }));
  return (
    <section id="skills" className="container-page py-14 md:py-16">
      <SectionHeading id="skills" title={t("title")} intro={t("intro")} />
      <SkillInventory
        groups={groups}
        labels={{
          connections: t("connections"),
          projects: t("projects"),
          experience: t("experience"),
          choose: t("choose"),
          hint: t("hint"),
          empty: t("empty"),
        }}
      />
    </section>
  );
}
