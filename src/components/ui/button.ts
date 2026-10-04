const base =
  "label-hud inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[3px] transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98]";

const variants = {
  primary: "bg-accent text-accent-ink hover:brightness-110",
  outline:
    "border border-ink/40 text-ink hover:border-accent hover:text-accent",
  ghost: "text-muted hover:text-ink",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClasses(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
