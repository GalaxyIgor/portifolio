import { getTranslations } from "next-intl/server";
import type { SectionId } from "@/components/layout/navItems";
import { ScrollCue } from "./ScrollCue";

/** Divisor entre seções: a seta discreta que leva à seção seguinte. */
export async function NextSection({ to }: { to: SectionId }) {
  const t = await getTranslations("nav");

  return (
    <div className="container-page flex justify-center">
      <ScrollCue to={to} ariaLabel={t("goTo", { section: t(to) })} />
    </div>
  );
}
