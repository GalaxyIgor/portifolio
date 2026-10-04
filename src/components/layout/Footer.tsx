import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. {t("built")}
        </p>
        <a href="#main" className="ritual-link label-hud">
          ↑ {t("top")}
        </a>
      </div>
    </footer>
  );
}
