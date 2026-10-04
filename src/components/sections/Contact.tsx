import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Ornament } from "@/components/ui/Ornament";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { CopyEmail } from "./CopyEmail";

export async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section
      id="contact"
      className="container-page pt-14 pb-24 md:pt-16 md:pb-32"
    >
      <SectionHeading id="contact" title={t("title")} intro={t("body")} />
      <Reveal>
        <a
          href={`mailto:${profile.email}`}
          className="ritual-link block font-display text-[clamp(2.25rem,8vw,6rem)] leading-none break-all"
        >
          {profile.email}
        </a>
        <div className="mt-10">
          <CopyEmail
            email={profile.email}
            labels={{
              copy: t("copy"),
              copied: t("copied"),
              failed: t("copyFailed"),
            }}
          />
        </div>
        <Ornament className="mt-20 text-ink" />
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-6">
          <p className="label-hud text-muted">{t("elsewhere")}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xl">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ritual-link inline-flex items-center gap-2 underline decoration-line underline-offset-[6px]"
                >
                  <SocialIcon name={social.label} />
                  <span>{social.label} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
