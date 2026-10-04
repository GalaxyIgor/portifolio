type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

const tick = "pointer-events-none absolute size-2 border-ink/70";

/** Caixa de linha fina com marcas nos cantos, como os painéis dos pôsteres. */
export function HudBox({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag className={`relative border border-line ${className}`}>
      <span
        aria-hidden
        className={`${tick} -top-px -left-px border-t border-l`}
      />
      <span
        aria-hidden
        className={`${tick} -top-px -right-px border-t border-r`}
      />
      <span
        aria-hidden
        className={`${tick} -bottom-px -left-px border-b border-l`}
      />
      <span
        aria-hidden
        className={`${tick} -right-px -bottom-px border-r border-b`}
      />
      {children}
    </Tag>
  );
}
