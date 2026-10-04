"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { Sparkle } from "@/components/ui/Sparkle";

/** Cada trecho da linha se desenha quando sua experiência entra na tela. */
export function ExperienceStep({
  date,
  children,
}: {
  date: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <li
      ref={ref}
      data-visible={visible}
      className="experience-step relative pb-16 pl-8 last:pb-0 md:grid md:grid-cols-[12rem_1fr] md:gap-10 md:pl-12"
    >
      <span
        aria-hidden="true"
        className="experience-marker absolute top-1 -left-[9px] grid size-[18px] place-items-center bg-bg text-accent"
      >
        <Sparkle className="size-[18px]" />
      </span>
      <div className="experience-date pt-1 label-hud text-muted">{date}</div>
      <div className="experience-content">{children}</div>
    </li>
  );
}
