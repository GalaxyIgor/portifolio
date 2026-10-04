import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page flex min-h-[60dvh] flex-col items-start justify-center py-24">
      <p className="label-hud text-accent">404</p>
      <h1 className="mt-4 font-display text-title">{t("title")}</h1>
      <p className="mt-4 text-xl text-muted italic">{t("body")}</p>
      <Link href="/" className={buttonClasses("outline", "mt-10")}>
        {t("back")}
      </Link>
    </div>
  );
}
