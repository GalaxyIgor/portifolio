/** Mira de HUD (✛ com círculo). */
export function Crosshair({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v7M12 16v7M1 12h7M16 12h7" />
    </svg>
  );
}
