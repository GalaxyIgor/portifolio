import { Sparkle } from "./Sparkle";

type Props = {
  id: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ id, title, intro, as: Tag = "h2" }: Props) {
  return (
    <div className="mb-14 md:mb-20">
      {/* Linha de HUD: o id é a mesma âncora usada na navegação */}
      <div
        aria-hidden
        className="mb-6 flex items-center gap-3 label-hud text-muted"
      >
        <Sparkle className="size-3 text-accent" />
        <span>#{id}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <Tag className="font-display text-title">{title}</Tag>
      {intro && (
        <p className="mt-5 max-w-xl text-xl text-muted italic">{intro}</p>
      )}
    </div>
  );
}
