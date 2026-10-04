"use client";

import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { HudBox } from "@/components/ui/HudBox";
import { Sparkle } from "@/components/ui/Sparkle";
import type { SectionId } from "./navItems";

type Props = {
  items: { id: SectionId; label: string }[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
};

/** Menu do celular: um segundo painel de HUD logo abaixo da barra. */
export function MobileMenu({ items, openLabel, closeLabel, navLabel }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        className="ritual-control grid size-9 place-items-center text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      <div
        hidden={!open}
        className="mobile-menu-panel absolute inset-x-0 top-[calc(100%+0.5rem)]"
      >
        <HudBox className="bg-bg/95 backdrop-blur-sm">
          <nav id={panelId} aria-label={navLabel}>
            <ul className="flex flex-col px-4 py-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="mobile-menu-item border-b border-line last:border-b-0"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <Link
                    href={{ pathname: "/", hash: item.id }}
                    onClick={() => setOpen(false)}
                    className="ritual-link flex items-center justify-between py-3 font-display text-3xl"
                  >
                    {item.label}
                    <span className="flex items-center gap-1.5 label-hud text-muted">
                      <Sparkle className="size-2 text-accent" />#{item.id}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </HudBox>
      </div>
    </div>
  );
}
