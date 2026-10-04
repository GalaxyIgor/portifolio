"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkle } from "@/components/ui/Sparkle";
import { sectionIds } from "./navItems";

const starIds = ["home", ...sectionIds] as const;
type StarId = (typeof starIds)[number];

/** Uma estrela por seção; o destaque acompanha a leitura no centro da tela. */
export function SectionStars() {
  const t = useTranslations("nav");
  const [active, setActive] = useState<StarId>("home");

  useEffect(() => {
    const sections = starIds.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    let frame = 0;

    const update = () => {
      frame = 0;
      const midpoint = window.innerHeight * 0.5;
      let current: StarId = "home";
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= midpoint) {
          current = section.id;
        }
      }
      // A última seção pode ser curta demais para alcançar o centro da tela.
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        current = "contact";
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      className="section-stars"
      aria-label={t("sections")}
      data-theme={active === "home" ? "dark" : undefined}
    >
      <ul>
        {starIds.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-label={t("goTo", { section: t(id) })}
              aria-current={active === id ? "location" : undefined}
              className="section-star"
            >
              <span className="section-star-label label-hud" aria-hidden>
                {t(id)}
              </span>
              <Sparkle className="section-star-icon" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
