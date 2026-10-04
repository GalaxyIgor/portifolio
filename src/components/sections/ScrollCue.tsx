import { Link } from "@/i18n/navigation";
import { Sparkle } from "@/components/ui/Sparkle";
import type { SectionId } from "@/components/layout/navItems";

type Props = { to: SectionId; ariaLabel: string; className?: string };

/**
 * Seta discreta que indica mais conteúdo abaixo e leva à próxima seção:
 * uma ✦ pequena desce por uma haste curta até o chevron.
 */
export function ScrollCue({ to, ariaLabel, className = "" }: Props) {
  return (
    <Link
      href={{ pathname: "/", hash: to }}
      aria-label={ariaLabel}
      className={`scroll-cue ritual-control pointer-events-auto flex flex-col items-center gap-0.5 p-2 text-ink/60 ${className}`}
    >
      <span aria-hidden className="relative h-6 w-2">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current opacity-40" />
        <Sparkle className="scroll-cue-star absolute top-0 left-1/2 size-1.5 -translate-x-1/2 text-accent" />
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="scroll-cue-chevron size-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8l7 7 7-7" />
      </svg>
    </Link>
  );
}
