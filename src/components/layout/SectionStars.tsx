"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkle } from "@/components/ui/Sparkle";
import { sectionIds } from "./navItems";

const starIds = ["home", ...sectionIds] as const;
type StarId = (typeof starIds)[number];
const IDLE_MS = 1200;

/** Uma estrela por seção; o destaque acompanha a leitura no centro da tela. */
export function SectionStars() {
  const t = useTranslations("nav");
  const [active, setActive] = useState<StarId>("home");
  const [hasChanged, setHasChanged] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef(0);
  const hovering = useRef(false);

  const show = useCallback(() => {
    setVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!hovering.current) setVisible(false);
    }, IDLE_MS);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(show);
    const onScroll = () => show();
    const onPointerMove = (event: PointerEvent) => {
      if (
        event.pointerType === "mouse" &&
        window.innerWidth - event.clientX < 88
      )
        show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [show]);

  useEffect(() => {
    const sections = starIds.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    if (!sections.length) return;
    let frame = 0;
    let previous: StarId = "home";

    const update = () => {
      frame = 0;
      const midpoint = window.innerHeight * 0.5;
      let current: StarId = "home";
      let index = 0;
      for (const [sectionIndex, section] of sections.entries()) {
        if (section.element.getBoundingClientRect().top <= midpoint) {
          current = section.id;
          index = sectionIndex;
        }
      }
      // A última seção pode ser curta demais para alcançar o centro da tela.
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        current = "contact";
        index = sections.length - 1;
      }
      const start =
        index === 0
          ? window.innerHeight * 0.5
          : sections[index].element.getBoundingClientRect().top +
            window.scrollY;
      const next = sections[index + 1];
      const end = next
        ? next.element.getBoundingClientRect().top + window.scrollY
        : start;
      const fraction = next
        ? Math.max(
            0,
            Math.min(
              1,
              (window.scrollY + midpoint - start) / Math.max(1, end - start),
            ),
          )
        : 0;
      const progress =
        window.scrollY <= 0
          ? 0
          : (index + fraction) / Math.max(1, sections.length - 1);
      track.current?.style.setProperty("--section-progress", String(progress));
      if (current !== previous) {
        previous = current;
        setActive(current);
        setHasChanged(true);
      }
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
      data-visible={visible ? "" : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          hovering.current = true;
          show();
        }
      }}
      onPointerLeave={() => {
        hovering.current = false;
        show();
      }}
      aria-label={t("sections")}
      data-theme={active === "home" ? "dark" : undefined}
    >
      <ul ref={track}>
        {starIds.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-label={t("goTo", { section: t(id) })}
              aria-current={active === id ? "location" : undefined}
              data-activated={hasChanged && active === id ? "" : undefined}
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
