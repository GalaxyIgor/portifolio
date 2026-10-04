"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Invólucro do header. Marca `data-past-hero` quando a pintura do hero
 * já saiu de baixo da barra; o CSS usa isso para trocar o vidro escuro
 * pelo painel opaco no tema da página. O estado inicial ("sobre o hero")
 * vem do CSS via :has([data-hero]), então não pisca no carregamento.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const header = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const bar = header.current;
    if (!hero || !bar) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px` },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      ref={header}
      data-past-hero={pastHero ? "" : undefined}
      className="site-header pointer-events-none sticky top-0 z-50 h-20"
    >
      {children}
    </header>
  );
}
