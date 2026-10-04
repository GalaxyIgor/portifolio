const base =
  "seal-button label-hud inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[3px]";

const variants = {
  primary: "seal-primary bg-accent text-accent-ink",
  outline: "seal-outline border border-ink/40 text-ink",
  ghost: "seal-ghost text-muted",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClasses(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
