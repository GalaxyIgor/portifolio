"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Sparkle } from "@/components/ui/Sparkle";
import type { SectionId } from "./navItems";

type Props = {
  items: { id: SectionId; label: string }[];
  label: string;
  className?: string;
};

/** Links das seções com scrollspy: a seção no meio da tela ganha o ✦. */
export function NavLinks({ items, label, className = "" }: Props) {
  const [active, setActive] = useState<SectionId | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      // Faixa estreita no meio da tela: só uma seção por vez
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setActive(null);
    };
  }, [items, pathname]);

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-6 lg:gap-8">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <Link
                href={{ pathname: "/", hash: item.id }}
                aria-current={isActive ? "true" : undefined}
                className="flex items-center gap-1.5 label-hud text-muted transition-colors hover:text-ink aria-[current]:text-ink"
              >
                <Sparkle
                  className={`size-2 text-accent transition-[opacity,transform] duration-300 ${isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
