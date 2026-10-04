import { Sparkle } from "./Sparkle";

type Props = { children: React.ReactNode; className?: string };

const corner = "poster-frame-corner text-ink absolute size-3.5";

/** Moldura de cantos arredondados com estrelas nos cantos, como o pôster KNIGHT. */
export function PosterFrame({ children, className = "" }: Props) {
  return (
    <div className={`relative p-3 ${className}`}>
      <Sparkle className={`${corner} top-0 left-0`} />
      <Sparkle className={`${corner} top-0 right-0`} />
      <Sparkle className={`${corner} bottom-0 left-0`} />
      <Sparkle className={`${corner} right-0 bottom-0`} />
      <div className="poster-frame-inner relative size-full overflow-hidden rounded-[18px] border border-line bg-surface">
        {children}
      </div>
    </div>
  );
}
