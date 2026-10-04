"use client";

import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";

type Props = {
  email: string;
  labels: { copy: string; copied: string; failed: string };
};

type Status = "idle" | "copied" | "failed";

export function CopyEmail({ email, labels }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), 2500);
    return () => clearTimeout(id);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button type="button" onClick={copy} className={buttonClasses("outline")}>
        {status === "copied" ? labels.copied : labels.copy}
      </button>
      <p role="status" className="text-sm text-muted">
        {status === "failed" && labels.failed}
        {status === "copied" && (
          <span className="sr-only">{labels.copied}</span>
        )}
      </p>
    </div>
  );
}
