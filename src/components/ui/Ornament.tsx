import { Sparkle } from "./Sparkle";

/** Divisor ✦—✦✦✦—✦, como o topo de um pôster medieval. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-1.5 ${className}`}>
      <Sparkle className="size-2" />
      <span className="h-px flex-1 bg-current opacity-60" />
      <Sparkle className="size-2.5" />
      <Sparkle className="size-4" />
      <Sparkle className="size-2.5" />
      <span className="h-px flex-1 bg-current opacity-60" />
      <Sparkle className="size-2" />
    </div>
  );
}
