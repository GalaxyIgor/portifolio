import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-16 mb-4 font-display text-5xl first:mt-0" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 text-lg font-semibold" {...props} />,
  p: (props) => (
    <p className="mb-5 text-lg leading-relaxed text-muted" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mb-6 list-disc space-y-2 pl-5 text-lg text-muted marker:text-accent"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-6 list-decimal space-y-2 pl-5 text-lg text-muted"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline underline-offset-4 hover:no-underline"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
