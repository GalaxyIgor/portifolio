"use client";

import { useEffect, useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { SectionId } from "./navItems";

type Props = {
  items: { id: SectionId; label: string }[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
};

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
        className="grid size-9 place-items-center rounded-md text-ink hover:bg-surface"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
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

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-16 border-b border-line bg-bg"
      >
        <ul className="container-page flex flex-col py-4">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={{ pathname: "/", hash: item.id }}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-line/60 py-4 font-display text-3xl"
              >
                {item.label}
                <span className="label-hud text-muted">§ {item.id}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
