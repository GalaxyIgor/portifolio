import { Link } from "@/i18n/navigation";
import { Sparkle } from "@/components/ui/Sparkle";

type Props = { label: string; ariaLabel: string; className?: string };

/**
 * Indicação de que há mais conteúdo abaixo do hero, e atalho para a
 * primeira seção: uma ✦ desce por uma haste fina até o chevron.
 */
export function ScrollCue({ label, ariaLabel, className = "" }: Props) {
  return (
    <Link
      href={{ pathname: "/", hash: "about" }}
      aria-label={ariaLabel}
      className={`group pointer-events-auto flex flex-col items-center gap-2 rounded-full border border-ink/20 bg-black/30 px-3 pt-3.5 pb-2.5 backdrop-blur-sm transition-colors hover:border-accent/60 ${className}`}
    >
      <span className="label-hud text-ink/80 transition-colors group-hover:text-ink">
        {label}
      </span>
      <span aria-hidden className="relative h-10 w-3">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/30" />
        <Sparkle className="scroll-cue-star absolute top-0 left-1/2 size-2.5 -translate-x-1/2 text-accent" />
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 text-accent transition-transform duration-300 group-hover:translate-y-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8l7 7 7-7" />
      </svg>
    </Link>
  );
}
