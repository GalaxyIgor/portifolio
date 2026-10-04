import { Sparkle } from "./Sparkle";
import { ThornVine } from "./ThornVine";

type Props = { children: React.ReactNode; className?: string; vines?: boolean };

const corner = "poster-frame-corner text-ink absolute size-3.5";

/** Moldura de cantos arredondados com estrelas nos cantos, como o pôster KNIGHT. */
export function PosterFrame({
  children,
  className = "",
  vines = false,
}: Props) {
  return (
    <div
      className={`relative p-3 ${vines ? "poster-frame-vines" : ""} ${className}`}
    >
      <Sparkle className={`${corner} top-0 left-0`} />
      <Sparkle className={`${corner} top-0 right-0`} />
      <Sparkle className={`${corner} bottom-0 left-0`} />
      <Sparkle className={`${corner} right-0 bottom-0`} />
      <div className="poster-frame-inner relative size-full overflow-hidden rounded-[18px] border border-line bg-surface">
        {children}
      </div>
      {vines && <ThornVine />}
    </div>
  );
}
