type IconProps = { className?: string };

function Icon({
  className = "size-6",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const SwordIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2l1.6 3v10h-3.2V5L12 2z" />
    <path d="M7 15h10M12 15v4.5" />
    <circle cx="12" cy="21" r="1.2" />
  </Icon>
);

export const RoseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 12c-3 0-4.5-2-4.5-4.2C7.5 5 9.6 3 12 3s4.5 2 4.5 4.8C16.5 10 15 12 12 12z" />
    <path d="M12 6.2c-1.3 0-2 .9-2 1.8 0 1 .9 1.8 2 1.8s2-.8 2-1.8" />
    <path d="M12 12v9M12 16c-1.5-1.8-3.6-2.2-5-1.6 1 1.8 3 2.6 5 1.6zM12 18c1.2-1.3 3-1.6 4.2-1" />
  </Icon>
);

export const HelmIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 21V9.5C5 5.4 8.1 3 12 3s7 2.4 7 6.5V21H5z" />
    <path d="M5 11h14M12 3v18M7.5 13.5h3M13.5 13.5h3" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5z" />
  </Icon>
);

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="4" ry="9" />
    <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
  </Icon>
);

export const AxeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2v20" />
    <path d="M12 5c3 0 6 1.5 7 4.5-1 3-4 4.5-7 4.5M12 5C9 5 6 6.5 5 9.5 6 12.5 9 14 12 14" />
  </Icon>
);

export const icons = {
  sword: SwordIcon,
  rose: RoseIcon,
  helm: HelmIcon,
  moon: MoonIcon,
  globe: GlobeIcon,
  axe: AxeIcon,
};

export type IconName = keyof typeof icons;
