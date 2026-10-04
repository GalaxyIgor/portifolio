import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";
import { sectionIds } from "./navItems";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const t = await getTranslations("nav");
  const tTheme = await getTranslations("theme");
  const items = sectionIds.map((id) => ({ id, label: t(id) }));

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[1.75rem] leading-none"
          aria-label={`${profile.name} — ${t("home")}`}
        >
          {profile.name}
          <span className="text-accent">·</span>
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={{ pathname: "/", hash: item.id }}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle label={tTheme("toggle")} />
          <MobileMenu
            items={items}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            navLabel={t("primary")}
          />
        </div>
      </div>
    </header>
  );
}
