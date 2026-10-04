export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[3px] border border-line px-2 py-1 label-hud text-muted">
      {children}
    </span>
  );
}
