import Image from "next/image";
import { PosterFrame } from "./PosterFrame";
import { icons, type IconName } from "./icons";

type Props = {
  slug: string;
  title: string;
  cover?: string;
  priority?: boolean;
};

const fallbackIcons: IconName[] = [
  "sword",
  "rose",
  "helm",
  "moon",
  "globe",
  "axe",
];

function hash(value: string) {
  let h = 0;
  for (const ch of value) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Capa emoldurada como pôster. Sem imagem, mostra um ícone de linha escolhido pelo slug. */
export function ProjectCover({ slug, title, cover, priority }: Props) {
  const Icon = icons[fallbackIcons[hash(slug) % fallbackIcons.length]];

  return (
    <PosterFrame className="project-cover aspect-[4/5]">
      {cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="project-cover-image object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="project-cover-fallback relative grid size-full place-items-center text-muted"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 40%, var(--accent-soft), transparent 70%)",
          }}
        >
          <Icon className="project-cover-icon size-1/3 stroke-[0.5]" />
          <span className="absolute bottom-4 left-4 label-hud">{slug}</span>
        </div>
      )}
    </PosterFrame>
  );
}
