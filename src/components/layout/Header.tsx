import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { profile } from "@/data/profile";
import { HudBox } from "@/components/ui/HudBox";
import { Sparkle } from "@/components/ui/Sparkle";
import { sectionIds } from "./navItems";
import { HeaderShell } from "./HeaderShell";
import { NavLinks } from "./NavLinks";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

/**
 * Navbar em forma de painel de HUD, do mesmo material da barra de baixo do
 * hero. Flutua sobre a pintura; compartimentos separados por linhas finas.
 */
export async function Header() {
  const t = await getTranslations("nav");
  const tTheme = await getTranslations("theme");
  const items = sectionIds.map((id) => ({ id, label: t(id) }));

  return (
    <HeaderShell>
      <div className="container-page pt-3">
        <HudBox className="site-bar pointer-events-auto flex h-14 items-stretch backdrop-blur-sm">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 font-display text-[1.75rem] leading-none transition-colors hover:text-accent"
            aria-label={`${profile.name} — ${t("home")}`}
          >
            {profile.name}
            <Sparkle className="size-2.5 text-accent" />
          </Link>

          <NavLinks
            items={items}
            label={t("primary")}
            className="hidden flex-1 items-center justify-center border-l border-line md:flex"
          />

          <div className="ml-auto flex items-center gap-1 border-l border-line px-2 md:ml-0">
            <LocaleSwitcher />
            <span aria-hidden className="mx-1 h-5 w-px bg-line" />
            <ThemeToggle label={tTheme("toggle")} />
            <MobileMenu
              items={items}
              openLabel={t("openMenu")}
              closeLabel={t("closeMenu")}
              navLabel={t("primary")}
            />
          </div>
        </HudBox>
      </div>
    </HeaderShell>
  );
}
