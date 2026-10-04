import type { ReactNode } from "react";

export default function ProjectTemplate({ children }: { children: ReactNode }) {
  return <div className="project-chapter-entry">{children}</div>;
}
